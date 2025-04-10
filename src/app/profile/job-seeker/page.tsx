"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function JobSeekerProfile() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(true);

	// Mock profile data for an Indian underprivileged job seeker
	const mockProfile = {
		firstName: "Priya",
		lastName: "Sharma",
		email: "priya.sharma@example.com",
		phone: "+91 98765 43210",
		address: "Slum Rehabilitation Colony, Govandi, Mumbai - 400088",
		background:
			"First-generation learner from urban slum background, single mother",
		disability: "Hearing Impairment",
		assistiveNeeds:
			"Sign language interpreter, Written communication preferred",
		skills: [
			"Customer Service",
			"Basic Computer Skills",
			"Hindi & English Communication",
			"Problem Solving",
			"Team Collaboration",
			"Data Entry",
			"Time Management",
		],
		education: [
			{
				institution: "Municipal School, Govandi",
				degree: "10th Standard",
				year: "2018",
				marks: "82%",
			},
			{
				institution: "Open School, Maharashtra",
				degree: "12th Standard",
				year: "2020",
				marks: "75%",
			},
		],
		training: [
			{
				program: "Customer Service & Communication Skills",
				organization: "Nayi Disha Foundation",
				duration: "3 months",
				year: "2021",
			},
			{
				program: "Basic Computer & Office Skills",
				organization: "National Skill Development Corporation",
				duration: "2 months",
				year: "2022",
			},
			{
				program: "Sign Language Training",
				organization: "Indian Sign Language Research & Training Center",
				duration: "6 months",
				year: "2022",
			},
		],
		workExperience: [
			{
				role: "Customer Support Associate (Intern)",
				organization: "Local NGO - Women Empowerment Program",
				duration: "6 months",
				description:
					"Handled customer queries through written communication, assisted in data entry for women's self-help groups",
			},
			{
				role: "Community Volunteer",
				organization: "Slum Rehabilitation Program",
				duration: "1 year",
				description:
					"Assisted in community development activities, helped in organizing awareness programs for women's education",
			},
		],
		achievements: [
			"Completed customer service training with distinction",
			"Successfully completed sign language certification",
			"Recognized for excellent performance during internship",
			"Active participant in community development programs",
			"Received scholarship for higher education",
		],
		specialCircumstances: [
			"Single mother with two children",
			"First in family to complete 12th standard",
			"Active member of local women's self-help group",
			"Volunteer at community education center",
		],
	};

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/signin");
		} else {
			setIsLoading(false);
		}
	}, [status, router]);

	if (status === "loading" || isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-4xl mx-auto">
					<div className="animate-pulse space-y-4">
						{[1, 2, 3].map((i) => (
							<div key={i} className="bg-white rounded-xl shadow-lg p-6">
								<div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
								<div className="space-y-3">
									<div className="h-4 bg-gray-200 rounded w-1/2"></div>
									<div className="h-4 bg-gray-200 rounded w-2/3"></div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-4xl mx-auto">
				<div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-blue-900">
					<div className="bg-gradient-to-r from-purple-50 to-teal-50 px-6 py-4 border-b border-gray-200">
						<div className="flex justify-between items-center">
							<h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
							<div className="flex gap-3">
								<button
									onClick={() => router.push("/dashboard/job-seeker")}
									className="bg-gradient-to-r from-blue-600 to-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-600 shadow-sm"
								>
									Go to Dashboard
								</button>
								<button
									onClick={() => router.push("/profile/job-seeker/edit")}
									className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-teal-600 shadow-sm"
								>
									Edit Profile
								</button>
							</div>
						</div>
					</div>

					<div className="p-6 space-y-8">
						{/* Personal Information */}
						<section className="border-2 border-blue-900 rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Personal Information
							</h2>
							<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Full Name
									</label>
									<p className="mt-1 text-gray-900">
										{mockProfile.firstName} {mockProfile.lastName}
									</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Email
									</label>
									<p className="mt-1 text-gray-900">{mockProfile.email}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Phone
									</label>
									<p className="mt-1 text-gray-900">{mockProfile.phone}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Address
									</label>
									<p className="mt-1 text-gray-900">{mockProfile.address}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Background
									</label>
									<p className="mt-1 text-gray-900">{mockProfile.background}</p>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Disability
									</label>
									<p className="mt-1 text-gray-900">{mockProfile.disability}</p>
								</div>
								<div className="md:col-span-2">
									<label className="block text-sm font-medium text-gray-700">
										Assistive Needs
									</label>
									<p className="mt-1 text-gray-900">
										{mockProfile.assistiveNeeds}
									</p>
								</div>
							</div>
						</section>

						{/* Special Circumstances */}
						<section className="border-2 border-blue-900 rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Special Circumstances
							</h2>
							<div className="bg-purple-50 rounded-lg p-4">
								<ul className="list-disc list-inside space-y-2">
									{mockProfile.specialCircumstances.map(
										(circumstance, index) => (
											<li key={index} className="text-gray-700">
												{circumstance}
											</li>
										)
									)}
								</ul>
							</div>
						</section>

						{/* Skills */}
						<section className="border-2 border-blue-900 rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Skills
							</h2>
							<div className="flex flex-wrap gap-2">
								{mockProfile.skills.map((skill, index) => (
									<span
										key={index}
										className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800"
									>
										{skill}
									</span>
								))}
							</div>
						</section>

						{/* Education */}
						<section className="border-2 border-blue-900 rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Education
							</h2>
							<div className="space-y-4">
								{mockProfile.education.map((edu, index) => (
									<div key={index} className="border rounded-lg p-4 bg-gray-50">
										<h3 className="font-medium text-gray-900">
											{edu.institution}
										</h3>
										<p className="text-gray-600">
											{edu.degree} ({edu.year}) - {edu.marks}
										</p>
									</div>
								))}
							</div>
						</section>

						{/* Training */}
						<section className="border-2 border-blue-900 rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Training Programs
							</h2>
							<div className="space-y-4">
								{mockProfile.training.map((train, index) => (
									<div key={index} className="border rounded-lg p-4 bg-gray-50">
										<h3 className="font-medium text-gray-900">
											{train.program}
										</h3>
										<p className="text-gray-600">
											{train.organization} ({train.duration}, {train.year})
										</p>
									</div>
								))}
							</div>
						</section>

						{/* Work Experience */}
						<section className="border-2 border-blue-900 rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Work Experience
							</h2>
							<div className="space-y-4">
								{mockProfile.workExperience.map((exp, index) => (
									<div key={index} className="border rounded-lg p-4 bg-gray-50">
										<h3 className="font-medium text-gray-900">{exp.role}</h3>
										<p className="text-gray-600">
											{exp.organization} ({exp.duration})
										</p>
										<p className="mt-2 text-gray-700">{exp.description}</p>
									</div>
								))}
							</div>
						</section>

						{/* Achievements */}
						<section className="border-2 border-blue-900 rounded-lg p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">
								Achievements
							</h2>
							<div className="bg-teal-50 rounded-lg p-4">
								<ul className="list-disc list-inside space-y-2">
									{mockProfile.achievements.map((achievement, index) => (
										<li key={index} className="text-gray-700">
											{achievement}
										</li>
									))}
								</ul>
							</div>
						</section>
					</div>
				</div>
			</div>
		</div>
	);
}
