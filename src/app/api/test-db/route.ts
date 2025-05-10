import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('Testing MongoDB Atlas connection...');
    const db = await connectDB();
    
    // Get database stats
    const stats = await db.connection.db.stats();
    
    return NextResponse.json({
      status: 'success',
      message: 'MongoDB Atlas connection successful',
      database: {
        name: db.connection.name,
        host: db.connection.host,
        port: db.connection.port,
        readyState: db.connection.readyState,
      },
      stats: {
        collections: stats.collections,
        documents: stats.objects,
        dataSize: stats.dataSize,
        storageSize: stats.storageSize,
      }
    });
  } catch (error) {
    console.error('MongoDB Atlas connection test failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'MongoDB Atlas connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 