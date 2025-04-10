import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import TimeSlot from "@/models/TimeSlot";
import User from "@/models/User";
import JobSeeker from "@/models/JobSeeker";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		await connectDB();

		// First get the interviewer's ID from their email
		const interviewer = await User.findOne({ email: session.user.email });
		if (!interviewer) {
			return NextResponse.json(
				{ error: "Interviewer not found" },
				{ status: 404 }
			);
		}

		// Get all time slots where this interviewer is assigned
		const timeSlots = await TimeSlot.find({
			interviewerId: interviewer._id,
			interviewDone: false,
		}).lean();

		if (!timeSlots || !Array.isArray(timeSlots)) {
			return NextResponse.json([]);
		}

		console.log("Found accepted time slots:", timeSlots.length);

		// Get all userIds from the time slots
		const userIds = timeSlots.map((slot) => slot.userId.toString());

		// Get all users and job seekers in parallel
		const [users, jobSeekers] = await Promise.all([
			User.find({ _id: { $in: userIds } }).lean(),
			JobSeeker.find({ userId: { $in: userIds } }).lean(),
		]);

		console.log("Data fetching results:", {
			timeSlots: timeSlots.length,
			foundUsers: users.length,
			foundJobSeekers: jobSeekers.length,
		});

		// Create maps for quick lookups
		const userMap = new Map(users.map((user) => [user._id.toString(), user]));
		const jobSeekerMap = new Map(
			jobSeekers.map((seeker) => [seeker.userId.toString(), seeker])
		);

		// Format the response with job seeker information
		const formattedInterviews = timeSlots.map((timeSlot) => {
			const userId = timeSlot.userId.toString();
			const user = userMap.get(userId);
			const jobSeeker = jobSeekerMap.get(userId);

			if (!user || !jobSeeker) {
				console.log("Missing data for accepted interview:", {
					timeSlotId: timeSlot._id.toString(),
					userId,
					hasUser: !!user,
					hasJobSeeker: !!jobSeeker,
				});
			}

			return {
				_id: timeSlot._id.toString(),
				userId: {
					_id: jobSeeker?._id.toString() || "unknown",
					name: jobSeeker
						? `${jobSeeker.firstName} ${jobSeeker.lastName}`
						: "Unknown User",
					email: user?.email || "No email provided",
					skills: jobSeeker?.skills || [],
					experience: jobSeeker?.experience || [],
				},
				jobRole: timeSlot.jobRole,
				timeSlot: timeSlot.timeSlot,
				interviewDone: timeSlot.interviewDone,
				createdAt: timeSlot.createdAt,
				skills: timeSlot.skills || [],
			};
		});

		console.log("Final processing summary:", {
			totalTimeSlots: timeSlots.length,
			processedInterviews: formattedInterviews.length,
			withMissingData: formattedInterviews.filter(
				(interview) => interview.userId.name === "Unknown User"
			).length,
		});

		return NextResponse.json(formattedInterviews);
	} catch (error) {
		console.error("Error fetching accepted interviews:", error);
		return NextResponse.json(
			{ error: "Failed to fetch accepted interviews" },
			{ status: 500 }
		);
	}
}
