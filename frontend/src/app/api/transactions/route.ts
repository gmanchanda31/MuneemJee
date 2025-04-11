import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { ObjectId } from 'mongodb';

// GET /api/transactions - Get all transactions for the current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const transactionsCollection = await getCollection('transactions');
    
    const transactions = await transactionsCollection
      .find({ userId })
      .sort({ date: -1 })
      .toArray();
    
    return NextResponse.json(transactions);
  } catch (error: any) {
    console.error('Error fetching transactions:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while fetching transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.amount || !data.type || !data.accountId || !data.date) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Handle invoice association if provided
    let invoiceId = data.invoiceId;
    if (invoiceId) {
      // Make sure invoiceId is a valid ObjectId
      if (!ObjectId.isValid(invoiceId)) {
        return NextResponse.json(
          { error: 'Invalid invoice ID' },
          { status: 400 }
        );
      }
      invoiceId = new ObjectId(invoiceId);
    }
    
    const transactionData = {
      ...data,
      amount: parseFloat(data.amount),
      date: new Date(data.date),
      invoiceId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Update account balance
    const accountsCollection = await getCollection('accounts');
    const account = await accountsCollection.findOne({ 
      _id: new ObjectId(data.accountId),
      userId 
    });
    
    if (!account) {
      return NextResponse.json(
        { error: 'Account not found' },
        { status: 404 }
      );
    }
    
    // Update balance based on transaction type
    let newBalance = account.balance;
    if (data.type === 'EXPENSE') {
      newBalance -= parseFloat(data.amount);
    } else if (data.type === 'INCOME') {
      newBalance += parseFloat(data.amount);
    }
    
    // Update account balance
    await accountsCollection.updateOne(
      { _id: new ObjectId(data.accountId) },
      { $set: { balance: newBalance, updatedAt: new Date() } }
    );
    
    // Create transaction
    const transactionsCollection = await getCollection('transactions');
    const result = await transactionsCollection.insertOne(transactionData);
    
    return NextResponse.json(
      { id: result.insertedId, ...transactionData },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while creating the transaction' },
      { status: 500 }
    );
  }
} 