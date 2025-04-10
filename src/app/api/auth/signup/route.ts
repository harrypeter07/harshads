import { NextResponse } from "next/server";
import {
	users,
	profiles,
	type User,
	type JobSeekerProfile,
	type InterviewerProfile,
} from "@/lib/mockData";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const {
			email,
			password,
			role,
			name,
			phone,
			company,
			position,
			expertise,
			experience,
		} = body;

		// Validate required fields
		if (
			!email ||
			!password ||
			!role ||
			!name ||
			!phone ||
			!company ||
			!position ||
			!expertise ||
			!experience
		) {
			return NextResponse.json(
				{ message: "All fields are required" },
				{ status: 400 }
			);
		}

		// Validate role
		if (!["job-seeker", "interviewer", "admin"].includes(role)) {
			return NextResponse.json({ message: "Invalid role" }, { status: 400 });
		}

		// Check if user already exists
		if (users.find((u) => u.email === email)) {
			return NextResponse.json(
				{ message: "User already exists" },
				{ status: 400 }
			);
		}

		// Create new user
		const newUser: User = {
			id: Date.now().toString(),
			name,
			email,
			password, // In a real app, you would hash this
			role,
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString(),
		};

		// Create profile based on role
		if (role === "job-seeker") {
			const newProfile: JobSeekerProfile = {
				userId: newUser.id,
				firstName: name.split(" ")[0],
				lastName: name.split(" ").slice(1).join(" "),
				phone: "",
				skills: [],
				experience: [],
				education: [],
				resume: "",
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			profiles[newUser.id] = newProfile;
		} else if (role === "interviewer") {
			const newProfile: InterviewerProfile = {
				userId: newUser.id,
				firstName: name.split(" ")[0],
				lastName: name.split(" ").slice(1).join(" "),
				phone: phone,
				company: company,
				position: position,
				expertise: expertise,
				experience: experience,
				workExperience: [
					{
						company: company,
						position: position,
						startDate: new Date().toISOString(),
						endDate: new Date().toISOString(),
						description: "Current position",
					},
				],
				education: [
					{
						institution: "University",
						degree: "Bachelor's Degree",
						field: "Human Resources",
						startDate: new Date().toISOString(),
						endDate: new Date().toISOString(),
					},
				],
				skills: expertise,
				languages: ["English", "Hindi"],
				certifications: [
					{
						name: "Interviewing Skills",
						issuer: "Professional Development",
						date: new Date().toISOString(),
					},
				],
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
			};
			profiles[newUser.id] = newProfile;
		}

		// In a real app, you would save this to a database
		users.push(newUser);

		return NextResponse.json(
			{
				message: "User created successfully",
				user: {
					id: newUser.id,
					name: newUser.name,
					email: newUser.email,
					role: newUser.role,
				},
			},
			{ status: 201 }
		);
	} catch (error) {
		console.error("Signup error:", error);
		return NextResponse.json(
			{ message: "Internal server error" },
			{ status: 500 }
		);
	}
}
