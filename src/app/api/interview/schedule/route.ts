import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import TimeSlot from '@/models/TimeSlot';
import JobSeeker from '@/models/JobSeeker';
import Interviewer from '@/models/Interviewer';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();

    const { timeSlot, jobRole } = await request.json();
    const userId = session.user.id;

    // Get job seeker details
    const jobSeeker = await JobSeeker.findOne({ userId });
    if (!jobSeeker) {
      return NextResponse.json(
        { error: 'Job seeker profile not found' },
        { status: 404 }
      );
    }

    // Check if there's already a scheduled interview
    const existingSchedule = await TimeSlot.findOne({ userId });
    if (existingSchedule) {
      return NextResponse.json(
        { error: 'Interview already scheduled. Use reschedule option.' },
        { status: 400 }
      );
    }

    // Assign an available interviewer
    const interviewer = await Interviewer.findOne().sort({ createdAt: 1 });
    if (!interviewer) {
      return NextResponse.json(
        { error: 'No interviewers available' },
        { status: 500 }
      );
    }

    // Create new interview schedule
    const newSchedule = await TimeSlot.create({
      userId,
      interviewerId: interviewer._id,
      skills: jobSeeker.skills,
      jobRole,
      timeSlot,
      interviewDone: false,
    });

    return NextResponse.json(newSchedule);
  } catch (error) {
    console.error('Error scheduling interview:', error);
    return NextResponse.json(
      { error: 'Failed to schedule interview', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    const userId = session.user.id;

    const schedule = await TimeSlot.findOne({ userId }).sort({ createdAt: -1 });
    if (!schedule) {
      return NextResponse.json(
        { error: 'No interview schedule found' },
        { status: 404 }
      );
    }

    return NextResponse.json(schedule);
  } catch (error) {
    console.error('Error fetching interview schedule:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interview schedule' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    const { timeSlot, jobRole } = await request.json();
    const userId = session.user.id;

    // Check if the user has an existing interview
    const existingSchedule = await TimeSlot.findOne({ userId });
    if (!existingSchedule) {
      return NextResponse.json(
        { error: 'No scheduled interview to reschedule' },
        { status: 404 }
      );
    }

    // Update the interview schedule
    existingSchedule.jobRole = jobRole;
    existingSchedule.timeSlot = timeSlot;
    await existingSchedule.save();

    return NextResponse.json({ message: 'Interview rescheduled successfully' });
  } catch (error) {
    console.error('Error rescheduling interview:', error);
    return NextResponse.json(
      { error: 'Failed to reschedule interview' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    const userId = session.user.id;

    const deletedSchedule = await TimeSlot.findOneAndDelete({ userId });
    if (!deletedSchedule) {
      return NextResponse.json(
        { error: 'No interview schedule found to cancel' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Interview cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling interview:', error);
    return NextResponse.json(
      { error: 'Failed to cancel interview' },
      { status: 500 }
    );
  }
}
