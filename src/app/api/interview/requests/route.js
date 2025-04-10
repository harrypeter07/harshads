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

		// First, get ALL time slots to understand the total data
		const allTimeSlots = await TimeSlot.find().lean();
		console.log("Total time slots in database:", allTimeSlots.length);

		// Then get the filtered requests
		const requests = await TimeSlot.find({
			interviewerId: null,
			interviewDone: false,
		}).lean();

		console.log("Filtering summary:", {
			totalTimeSlots: allTimeSlots.length,
			pendingInterviews: requests.length,
			filtered: allTimeSlots.length - requests.length,
		});

		// Log the breakdown of filtered slots
		const breakdownByStatus = {
			hasInterviewer: allTimeSlots.filter((slot) => slot.interviewerId != null)
				.length,
			interviewDone: allTimeSlots.filter((slot) => slot.interviewDone === true)
				.length,
			availableForInterview: requests.length,
		};
		console.log("Time slots breakdown:", breakdownByStatus);

		if (!requests || !Array.isArray(requests)) {
			console.log("No pending interview requests found");
			return NextResponse.json([]);
		}

		// Get all userIds from requests (without making them unique)
		const userIds = requests.map((request) => request.userId.toString());
		console.log("Total User IDs in pending requests:", userIds.length);

		// Get all users and job seekers in parallel
		const [users, jobSeekers] = await Promise.all([
			User.find({ _id: { $in: userIds } }).lean(),
			JobSeeker.find({ userId: { $in: userIds } }).lean(),
		]);

		console.log("Data fetching results:", {
			totalUserIds: userIds.length,
			foundUsers: users.length,
			foundJobSeekers: jobSeekers.length,
		});

		// Create maps for quick lookups
		const userMap = new Map(users.map((user) => [user._id.toString(), user]));
		const jobSeekerMap = new Map(
			jobSeekers.map((seeker) => [seeker.userId.toString(), seeker])
		);

		// Transform the data
		const transformedRequests = requests.map((request) => {
			const userId = request.userId.toString();
			const user = userMap.get(userId);
			const jobSeeker = jobSeekerMap.get(userId);

			if (!user || !jobSeeker) {
				console.log("Missing data for request:", {
					requestId: request._id.toString(),
					userId,
					timeSlot: request.timeSlot,
					jobRole: request.jobRole,
					hasUser: !!user,
					hasJobSeeker: !!jobSeeker,
				});
				return null;
			}

			return {
				_id: request._id.toString(),
				userId: {
					_id: jobSeeker._id.toString(),
					name: `${jobSeeker.firstName} ${jobSeeker.lastName}`,
					email: user.email,
					skills: jobSeeker.skills || [],
					experience: jobSeeker.experience || [],
				},
				jobRole: request.jobRole,
				timeSlot: request.timeSlot,
				interviewDone: request.interviewDone,
				createdAt: request.createdAt,
				skills: request.skills || [],
			};
		});

		const validRequests = transformedRequests.filter(
			(request) => request !== null
		);

		console.log("Final processing summary:", {
			totalTimeSlots: allTimeSlots.length,
			pendingRequests: requests.length,
			validRequestsWithUserData: validRequests.length,
			missingDataRequests: requests.length - validRequests.length,
		});

		if (validRequests.length < requests.length) {
			const missingRequests = requests.filter((request) => {
				const userId = request.userId.toString();
				return !userMap.get(userId) || !jobSeekerMap.get(userId);
			});

			console.log(
				"Requests with missing user/jobseeker data:",
				missingRequests.map((req) => ({
					requestId: req._id.toString(),
					userId: req.userId.toString(),
					jobRole: req.jobRole,
					timeSlot: req.timeSlot,
					hasUser: !!userMap.get(req.userId.toString()),
					hasJobSeeker: !!jobSeekerMap.get(req.userId.toString()),
				}))
			);
		}

		return NextResponse.json(validRequests);
	} catch (error) {
		console.error("Error fetching interview requests:", error);
		return NextResponse.json(
			{ error: "Failed to fetch interview requests" },
			{ status: 500 }
		);
	}
}

export async function POST(request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		await connectDB();

		// Get the interviewer's ID
		const interviewer = await User.findOne({ email: session.user.email });
		if (!interviewer) {
			return NextResponse.json(
				{ error: "Interviewer not found" },
				{ status: 404 }
			);
		}

		// Get the request ID from the URL
		const requestId = new URL(request.url).searchParams.get("requestId");
		if (!requestId) {
			return NextResponse.json(
				{ error: "Request ID is required" },
				{ status: 400 }
			);
		}

		// Update the interview request with the interviewer's ID
		const updatedRequest = await TimeSlot.findByIdAndUpdate(
			requestId,
			{ interviewerId: interviewer._id },
			{ new: true }
		).lean();

		if (!updatedRequest) {
			return NextResponse.json(
				{ error: "Interview request not found" },
				{ status: 404 }
			);
		}

		// Get the user and JobSeeker data using the same userId
		const [user, jobSeeker] = await Promise.all([
			User.findById(updatedRequest.userId).lean(),
			JobSeeker.findOne({ userId: updatedRequest.userId }).lean(),
		]);

		if (!user || !jobSeeker) {
			return NextResponse.json(
				{ error: "User or JobSeeker data not found" },
				{ status: 404 }
			);
		}

		const response = {
			...updatedRequest,
			userId: {
				_id: jobSeeker._id.toString(),
				name: `${jobSeeker.firstName} ${jobSeeker.lastName}`,
				email: user.email,
				skills: jobSeeker.skills || [],
				experience: jobSeeker.experience || [],
			},
		};

		return NextResponse.json(response);
	} catch (error) {
		console.error("Error accepting interview request:", error);
		return NextResponse.json(
			{ error: "Failed to accept interview request" },
			{ status: 500 }
		);
	}
}
