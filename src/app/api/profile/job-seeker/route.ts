import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import JobSeeker from "@/models/JobSeeker";

interface Experience {
	company: string;
	position: string;
	startDate: Date;
	endDate: Date | null;
	description: string;
}

interface Education {
	institution: string;
	degree: string;
	field: string;
	startDate: Date;
	endDate: Date | null;
}

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		await connectDB();

		const profile = await JobSeeker.findOne({ userId: session.user.id })
			.select("-__v")
			.lean();

		if (!profile) {
			return NextResponse.json({ error: "Profile not found" }, { status: 404 });
		}

		return NextResponse.json(profile);
	} catch (error: unknown) {
		console.error("Error fetching job seeker profile:", error);
		return NextResponse.json(
			{ error: "Failed to fetch job seeker profile" },
			{ status: 500 }
		);
	}
}

export async function POST(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		const data = await request.json();
		const {
			firstName,
			lastName,
			phone,
			skills,
			experience,
			education,
			resume,
		} = data;

		await connectDB();

		// Convert skills string to array
		const skillsArray = skills
			.split(",")
			.map((skill: string) => skill.trim())
			.filter((skill: string) => skill.length > 0);

		// Update or create profile using findOneAndUpdate with upsert
		const profile = await JobSeeker.findOneAndUpdate(
			{ userId: session.user.id },
			{
				$set: {
					userId: session.user.id,
					firstName,
					lastName,
					phone,
					skills: skillsArray,
					experience: experience.map((exp: Experience) => ({
						company: exp.company,
						position: exp.position,
						startDate: new Date(exp.startDate),
						endDate: exp.endDate ? new Date(exp.endDate) : null,
						description: exp.description,
					})),
					education: education.map((edu: Education) => ({
						institution: edu.institution,
						degree: edu.degree,
						field: edu.field,
						startDate: new Date(edu.startDate),
						endDate: edu.endDate ? new Date(edu.endDate) : null,
					})),
					resume,
				},
			},
			{ new: true, upsert: true }
		)
			.select("-__v")
			.lean();

		return NextResponse.json(profile);
	} catch (error: unknown) {
		console.error("Error updating job seeker profile:", error);
		return NextResponse.json(
			{ error: "Failed to update job seeker profile" },
			{ status: 500 }
		);
	}
}
