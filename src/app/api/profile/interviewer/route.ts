import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Interviewer from "@/models/Interviewer";

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: "You must be logged in." },
				{ status: 401 }
			);
		}

		if (session.user.role !== "interviewer") {
			return NextResponse.json(
				{ error: "You must be an interviewer to access this profile." },
				{ status: 403 }
			);
		}

		await connectDB();

		const interviewer = await Interviewer.findOne({ userId: session.user.id });

		if (!interviewer) {
			return NextResponse.json(
				{ error: "Interviewer profile not found." },
				{ status: 404 }
			);
		}

		return NextResponse.json(interviewer);
	} catch (error) {
		console.error("Error fetching interviewer profile:", error);
		return NextResponse.json(
			{ error: "Error fetching interviewer profile." },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: "You must be logged in." },
				{ status: 401 }
			);
		}

		if (session.user.role !== "interviewer") {
			return NextResponse.json(
				{ error: "You must be an interviewer to update this profile." },
				{ status: 403 }
			);
		}

		const data = await request.json();
		await connectDB();

		// Create or update interviewer profile
		const interviewer = await Interviewer.findOneAndUpdate(
			{ userId: session.user.id },
			{
				userId: session.user.id,
				firstName: data.firstName,
				lastName: data.lastName,
				phone: data.phone,
				expertise: data.expertise.split(",").map((exp: string) => exp.trim()),
				experience: parseInt(data.experience),
				company: data.company,
				position: data.position,
				availability: data.availability,
			},
			{ upsert: true, new: true, runValidators: true }
		);

		return NextResponse.json(interviewer);
	} catch (error) {
		console.error("Error updating interviewer profile:", error);
		return NextResponse.json(
			{ error: "Error updating interviewer profile." },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: "You must be logged in." },
				{ status: 401 }
			);
		}

		if (session.user.role !== "interviewer") {
			return NextResponse.json(
				{ error: "You must be an interviewer to update this profile." },
				{ status: 403 }
			);
		}

		const body = await request.json();
		await connectDB();

		const interviewer = await Interviewer.findOneAndUpdate(
			{ userId: session.user.id },
			{ $set: body },
			{ new: true, runValidators: true }
		);

		if (!interviewer) {
			return NextResponse.json(
				{ error: "Interviewer profile not found." },
				{ status: 404 }
			);
		}

		return NextResponse.json(interviewer);
	} catch (error) {
		console.error("Error updating interviewer profile:", error);
		return NextResponse.json(
			{ error: "Error updating interviewer profile." },
			{ status: 500 }
		);
	}
}
