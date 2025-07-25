import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import { prisma } from '@/app/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const settings = await prisma.userSettings.findUnique({
      where: {
        userId: session.user.id,
      },
    });

    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        selectedModel: '',
        temperature: 0.7,
        maxTokens: 2000,
        topP: 1.0,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    const settings = await prisma.userSettings.upsert({
      where: {
        userId: session.user.id,
      },
      update: data,
      create: {
        userId: session.user.id,
        ...data,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error saving user settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
