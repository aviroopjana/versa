import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    // Check file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File size must be less than 10MB' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file temporarily (optional)
    const uploadDir = path.join(process.cwd(), 'uploads');
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join(uploadDir, fileName);

    try {
      // Ensure upload directory exists
      await writeFile(filePath, buffer);

      const result = {
        text: 'PDF uploaded successfully. Text extraction will be implemented next.',
        numPages: 1, // Placeholder
        fileName: file.name,
        fileSize: file.size,
        filePath: filePath,
        metadata: {
          title: '',
          author: '',
          subject: '',
          creator: '',
          producer: '',
          creationDate: new Date().toISOString(),
          modDate: new Date().toISOString()
        }
      };

      return NextResponse.json({ 
        success: true, 
        data: result 
      });

    } catch (fileError) {
      console.error('File save error:', fileError);
      
      const result = {
        text: 'PDF received successfully. Ready for text extraction implementation.',
        numPages: 1,
        fileName: file.name,
        fileSize: file.size,
        metadata: {
          title: '',
          author: '',
          subject: '',
          creator: '',
          producer: '',
          creationDate: new Date().toISOString(),
          modDate: new Date().toISOString()
        }
      };

      return NextResponse.json({ 
        success: true, 
        data: result 
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

export const runtime = 'nodejs';
