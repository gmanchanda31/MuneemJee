import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// GET /api/accounts - Get all accounts for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const accountsCollection = await getCollection('accounts');
    
    const accounts = await accountsCollection
      .find({ userId })
      .sort({ name: 1 })
      .toArray();
    
    return NextResponse.json(accounts);
  } catch (error: any) {
    console.error('Error fetching accounts:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching accounts' },
      { status: 500 }
    );
  }
}

// POST /api/accounts - Create a new account
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.name || !data.type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const accountData = {
      ...data,
      balance: data.balance ? parseFloat(data.balance) : 0,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const accountsCollection = await getCollection('accounts');
    const result = await accountsCollection.insertOne(accountData);
    
    return NextResponse.json(
      { id: result.insertedId, ...accountData },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating account:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating the account' },
      { status: 500 }
    );
  }
} 