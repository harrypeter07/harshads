import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';

export async function GET(request, context) {
  try {
    await connectDB();
    const { userId } = context.params;

    const schedule = await TimeSlot.findOne({ userId }).sort({ createdAt: -1 });
    return NextResponse.json(schedule);
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { error: 'Failed to fetch interview schedule' },
      { status: 500 }
    );
  }
}