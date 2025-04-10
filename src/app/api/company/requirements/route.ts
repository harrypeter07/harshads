import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import CompanyRequirement from "@/models/CompanyRequirement";
import Company from "@/models/Company";

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

		// Find the company first
		const company = await Company.findOne({ userId: session.user.id });
		if (!company) {
			return NextResponse.json(
				{ error: "Company profile not found" },
				{ status: 404 }
			);
		}

		// Get all requirements for this company
		const requirements = await CompanyRequirement.find({
			companyId: company._id,
		})
			.sort({ createdAt: -1 })
			.lean();

		return NextResponse.json(requirements);
	} catch (error) {
		console.error("Error fetching requirements:", error);
		return NextResponse.json(
			{ error: "Error fetching requirements" },
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

		await connectDB();

		// Find the company first
		const company = await Company.findOne({ userId: session.user.id });
		if (!company) {
			return NextResponse.json(
				{ error: "Company profile not found" },
				{ status: 404 }
			);
		}

		const data = await request.json();

		// Convert string arrays
		const mandatorySkills = data.mandatorySkills
			.split(",")
			.map((skill: string) => skill.trim())
			.filter(Boolean);

		const preferredSkills = data.preferredSkills
			.split(",")
			.map((skill: string) => skill.trim())
			.filter(Boolean);

		const interviewRounds = data.interviewRounds
			.split(",")
			.map((round: string) => round.trim())
			.filter(Boolean);

		// Create new requirement
		const requirement = await CompanyRequirement.create({
			companyId: company._id,
			jobTitle: data.jobTitle,
			experienceLevel: data.experienceLevel,
			mandatorySkills,
			preferredSkills,
			minimumQualification: data.minimumQualification,
			employmentType: data.employmentType,
			workMode: data.workMode,
			salaryRange: {
				min: data.salaryRange.min,
				max: data.salaryRange.max,
			},
			jobLocation: data.jobLocation,
			aptitudeTestRequired: data.aptitudeTestRequired,
			codingRoundRequired: data.codingRoundRequired,
			interviewRounds,
		});

		return NextResponse.json(requirement);
	} catch (error) {
		console.error("Error creating requirement:", error);
		return NextResponse.json(
			{ error: "Error creating requirement" },
			{ status: 500 }
		);
	}
}

export async function PUT(request: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user) {
			return NextResponse.json(
				{ error: "Authentication required" },
				{ status: 401 }
			);
		}

		await connectDB();

		// Find the company first
		const company = await Company.findOne({ userId: session.user.id });
		if (!company) {
			return NextResponse.json(
				{ error: "Company profile not found" },
				{ status: 404 }
			);
		}

		const data = await request.json();

		// Convert string arrays
		const mandatorySkills = data.mandatorySkills
			.split(",")
			.map((skill: string) => skill.trim())
			.filter(Boolean);

		const preferredSkills = data.preferredSkills
			.split(",")
			.map((skill: string) => skill.trim())
			.filter(Boolean);

		const interviewRounds = data.interviewRounds
			.split(",")
			.map((round: string) => round.trim())
			.filter(Boolean);

		// Update requirement
		const requirement = await CompanyRequirement.findOneAndUpdate(
			{ _id: data.requirementId, companyId: company._id },
			{
				$set: {
					jobTitle: data.jobTitle,
					experienceLevel: data.experienceLevel,
					mandatorySkills,
					preferredSkills,
					minimumQualification: data.minimumQualification,
					employmentType: data.employmentType,
					workMode: data.workMode,
					salaryRange: {
						min: data.salaryRange.min,
						max: data.salaryRange.max,
					},
					jobLocation: data.jobLocation,
					aptitudeTestRequired: data.aptitudeTestRequired,
					codingRoundRequired: data.codingRoundRequired,
					interviewRounds,
					updatedAt: new Date(),
				},
			},
			{ new: true }
		);

		if (!requirement) {
			return NextResponse.json(
				{ error: "Requirement not found" },
				{ status: 404 }
			);
		}

		return NextResponse.json(requirement);
	} catch (error) {
		console.error("Error updating requirement:", error);
		return NextResponse.json(
			{ error: "Error updating requirement" },
			{ status: 500 }
		);
	}
}
