import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getCollection } from '@/lib/mongodb';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

// Helper functions
function generateKey(originalName: string, userId: string): string {
  const timestamp = Date.now();
  const extension = originalName.split('.').pop();
  return `users/${userId}/${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
}

async function getSignedUrlForObject(key: string, expiresIn = 3600): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn });
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const amount = formData.get('amount') as string | null;
    const vendor = formData.get('vendor') as string | null;
    const date = formData.get('date') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const key = generateKey(file.name, userId);
    
    // Convert file to ArrayBuffer
    const fileBuffer = await file.arrayBuffer();
    
    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_AWS_S3_BUCKET!,
      Key: key,
      Body: Buffer.from(fileBuffer),
      ContentType: file.type,
      Metadata: {
        originalName: file.name,
        uploadedBy: userId,
        uploadedAt: new Date().toISOString(),
      },
    });

    await s3Client.send(command);
    
    // Get a signed URL for immediate access
    const url = await getSignedUrlForObject(key);
    
    // Create invoice record if amount is provided
    if (amount) {
      const invoicesCollection = await getCollection('invoices');
      const invoiceData = {
        fileName: file.name,
        fileUrl: url,
        fileKey: key,
        amount: parseFloat(amount),
        vendor: vendor || 'Unknown',
        date: date ? new Date(date) : new Date(),
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const result = await invoicesCollection.insertOne(invoiceData);
      
      return NextResponse.json({
        key,
        url,
        invoice: {
          id: result.insertedId,
          ...invoiceData
        }
      }, { status: 200 });
    }
    
    return NextResponse.json({ key, url }, { status: 200 });
  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to upload file' },
      { status: 500 }
    );
  }
} 