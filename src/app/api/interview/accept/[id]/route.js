import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import JobSeeker from "@/models/JobSeeker";
import User from "@/models/User";

export async function POST(req, context) {
  try {
    await connectDB();
    const { id } = context.params;
    const body = await req.json();
    const { interviewerId } = body;

    if (!interviewerId) {
      return NextResponse.json(
        { error: "Interviewer ID is required" },
        { status: 400 }
      );
    }

    // First check if the time slot is still available
    const existingTimeSlot = await TimeSlot.findById(id);

    if (!existingTimeSlot) {
      return NextResponse.json(
        { error: "Interview request not found" },
        { status: 404 }
      );
    }

    if (existingTimeSlot.interviewerId !== null) {
      return NextResponse.json(
        {
          error:
            "This interview request has already been accepted by another interviewer",
        },
        { status: 400 }
      );
    }

    // Update the time slot
    const updatedTimeSlot = await TimeSlot.findOneAndUpdate(
      {
        _id: id,
        interviewerId: null,
      },
      { interviewerId },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTimeSlot) {
      return NextResponse.json(
        {
          error:
            "Failed to accept interview request. It may have been already accepted.",
        },
        { status: 409 }
      );
    }

    // Find the corresponding job seeker and user
    const [jobSeeker, user] = await Promise.all([
      JobSeeker.findOne({ userId: updatedTimeSlot.userId }),
      User.findById(updatedTimeSlot.userId),
    ]);

    // Format the response
    const formattedResponse = {
      ...updatedTimeSlot.toObject(),
      userId: jobSeeker
        ? {
            name: `${jobSeeker.firstName} ${jobSeeker.lastName}`,
            email: user?.email || "No email provided",
            _id: jobSeeker._id,
            skills: jobSeeker.skills || [],
            experience: jobSeeker.experience || [],
          }
        : {
            name: "Unknown User",
            email: user?.email || "No email provided",
            _id: updatedTimeSlot.userId,
            skills: [],
            experience: [],
          },
    };

    return NextResponse.json(formattedResponse);
  } catch (error) {
    console.error("Error accepting interview request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to accept interview request" },
      { status: 500 }
    );
  }
}