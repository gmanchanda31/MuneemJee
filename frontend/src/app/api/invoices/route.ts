import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

// GET /api/invoices - Get all invoices for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const invoicesCollection = await getCollection('invoices');
    
    const invoices = await invoicesCollection
      .find({ userId })
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching invoices' },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.fileName || !data.fileUrl || !data.fileKey || !data.amount || !data.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const invoiceData = {
      ...data,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const invoicesCollection = await getCollection('invoices');
    const result = await invoicesCollection.insertOne(invoiceData);
    
    return NextResponse.json(
      { id: result.insertedId, ...invoiceData },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating the invoice' },
      { status: 500 }
    );
  }
} 