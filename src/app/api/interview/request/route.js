import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";

const VALID_TIME_SLOTS = [
	"1:00 PM – 3:00 PM",
	"3:00 PM – 6:00 PM",
	"6:00 PM – 9:00 PM",
	"9:00 PM – 12:00 AM",
];

export async function POST(req) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		await connectDB();
		const body = await req.json();
		const { userId, skills, jobRole, timeSlot } = body;

		if (!userId || !skills || !jobRole || !timeSlot) {
			return NextResponse.json(
				{ error: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Validate timeSlot format
		if (!VALID_TIME_SLOTS.includes(timeSlot)) {
			return NextResponse.json(
				{
					error:
						"Invalid timeSlot format. Please use one of: " +
						VALID_TIME_SLOTS.join(", "),
					validTimeSlots: VALID_TIME_SLOTS,
				},
				{ status: 400 }
			);
		}

		// Check if user already has a pending interview
		const existingInterview = await TimeSlot.findOne({
			userId,
			interviewDone: false,
		});

		if (existingInterview) {
			return NextResponse.json(
				{ error: "User already has a pending interview request" },
				{ status: 400 }
			);
		}

		const newTimeSlot = await TimeSlot.create({
			userId,
			skills,
			jobRole,
			timeSlot,
			interviewerId: null,
			interviewDone: false,
		});

		return NextResponse.json(newTimeSlot);
	} catch (error) {
		console.error("Error creating interview request:", error);
		return NextResponse.json(
			{ error: "Failed to create interview request" },
			{ status: 500 }
		);
	}
}
