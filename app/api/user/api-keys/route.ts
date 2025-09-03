import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';
import { encrypt, decrypt } from '@/app/lib/encryption';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user exists in database (in case of database reset)
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!userExists) {
      return NextResponse.json({ 
        error: 'User session invalid. Please sign out and sign in again.' 
      }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        provider: true,
        key: true,
        isActive: true,
        createdAt: true,
      },
    });

    // Decrypt keys for display (masked)
    const decryptedKeys = apiKeys.map(key => ({
      ...key,
      key: decrypt(key.key),
    }));

    return NextResponse.json(decryptedKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, provider, key } = await request.json();

    if (!name || !provider || !key) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user exists in database (in case of database reset)
    const userExists = await prisma.user.findUnique({
      where: { id: session.user.id }
    });

    if (!userExists) {
      return NextResponse.json({ 
        error: 'User session invalid. Please sign out and sign in again.' 
      }, { status: 401 });
    }

    // Encrypt the API key before storing
    const encryptedKey = encrypt(key);

    const apiKey = await prisma.apiKey.create({
      data: {
        name,
        provider,
        key: encryptedKey,
        userId: session.user.id,
        isActive: true,
      },
    });

    return NextResponse.json({
      ...apiKey,
      key: key, // Return original key for immediate use
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
