"use client";

import { useRouter } from "next/navigation";

export interface ProfileData {
	role: "job-seeker" | "interviewer";
	name?: string;
	email?: string;
	phone?: string;
	location?: string;
	bio?: string;
	skills?: string[];
	experience?: string;
	education?: string;
	expertise?: string[];
	specialization?: string;
}

interface ProfileInfoCardProps {
	profile: ProfileData;
	isLoading: boolean;
}

export default function ProfileInfoCard({
	profile,
	isLoading,
}: ProfileInfoCardProps) {
	const router = useRouter();

	const getRoleDisplay = (role: string) => {
		switch (role) {
			case "job-seeker":
				return "Job Seeker";
			case "interviewer":
				return "Interviewer";
			case "company":
				return "Company";
			default:
				return role;
		}
	};

	if (isLoading) {
		return (
			<div className="bg-white shadow rounded-lg p-6 mb-6">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
					<div className="space-y-3">
						<div className="h-4 bg-gray-200 rounded w-3/4"></div>
						<div className="h-4 bg-gray-200 rounded w-1/2"></div>
						<div className="h-4 bg-gray-200 rounded w-2/3"></div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="bg-white rounded-xl shadow-lg overflow-hidden">
			<div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
					<button
						onClick={() => router.push(`/profile/${profile.role}/edit`)}
						className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
					>
						Edit Profile
					</button>
				</div>
			</div>

			<div className="px-6 py-5 space-y-6">
				{/* Basic Information */}
				<div>
					<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
						<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						Basic Information
					</h3>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="bg-gray-50 p-4 rounded-lg">
							<p className="text-sm text-gray-600 mb-1">Full Name</p>
							<p className="text-gray-800 font-medium">
								{profile.name || "Not provided"}
							</p>
						</div>
						<div className="bg-gray-50 p-4 rounded-lg">
							<p className="text-sm text-gray-600 mb-1">Email</p>
							<p className="text-gray-800 font-medium">{profile.email || "Not provided"}</p>
						</div>
						<div className="bg-gray-50 p-4 rounded-lg">
							<p className="text-sm text-gray-600 mb-1">Phone</p>
							<p className="text-gray-800 font-medium">{profile.phone || "Not provided"}</p>
						</div>
						<div className="bg-gray-50 p-4 rounded-lg">
							<p className="text-sm text-gray-600 mb-1">Role</p>
							<p className="text-gray-800 font-medium">{getRoleDisplay(profile.role)}</p>
						</div>
					</div>
				</div>

				{/* Role-specific Information */}
				{profile.role === "job-seeker" && (
					<>
						<div className="bg-white rounded-xl shadow-lg overflow-hidden">
							<div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
								<div className="flex justify-between items-center">
									<h2 className="text-xl font-semibold text-gray-900">Professional Information</h2>
									<button
										onClick={() => router.push(`/profile/${profile.role}/edit`)}
										className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
									>
										Edit Profile
									</button>
								</div>
							</div>
							<div className="px-6 py-5 space-y-6">
								<div>
									<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
										Professional Information
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="bg-gray-50 p-4 rounded-lg">
											<p className="text-sm text-gray-600 mb-1">Experience</p>
											<p className="text-gray-800 font-medium">
												{profile.experience || "Not provided"}
											</p>
										</div>
										<div className="bg-gray-50 p-4 rounded-lg">
											<p className="text-sm text-gray-600 mb-1">Skills</p>
											<p className="text-gray-800 font-medium">
												{profile.skills?.join(", ") || "Not provided"}
											</p>
										</div>
										<div className="bg-gray-50 p-4 rounded-lg">
											<p className="text-sm text-gray-600 mb-1">Education</p>
											<p className="text-gray-800 font-medium">
												{profile.education || "Not provided"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)}

				{profile.role === "interviewer" && (
					<>
						<div className="bg-white rounded-xl shadow-lg overflow-hidden">
							<div className="bg-indigo-50 px-6 py-4 border-b border-gray-200">
								<div className="flex justify-between items-center">
									<h2 className="text-xl font-semibold text-gray-900">Interviewer Information</h2>
									<button
										onClick={() => router.push(`/profile/${profile.role}/edit`)}
										className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200"
									>
										Edit Profile
									</button>
								</div>
							</div>
							<div className="px-6 py-5 space-y-6">
								<div>
									<h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
										<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										Interviewer Information
									</h3>
									<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
										<div className="bg-gray-50 p-4 rounded-lg">
											<p className="text-sm text-gray-600 mb-1">Specialization</p>
											<p className="text-gray-800 font-medium">
												{profile.specialization || "Not provided"}
											</p>
										</div>
										<div className="bg-gray-50 p-4 rounded-lg">
											<p className="text-sm text-gray-600 mb-1">Experience</p>
											<p className="text-gray-800 font-medium">
												{profile.experience || "Not provided"}
											</p>
										</div>
										<div className="bg-gray-50 p-4 rounded-lg">
											<p className="text-sm text-gray-600 mb-1">Expertise</p>
											<p className="text-gray-800 font-medium">
												{profile.expertise?.join(", ") || "Not provided"}
											</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	);
}
