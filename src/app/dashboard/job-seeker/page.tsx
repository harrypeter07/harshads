"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProfileInfoCard from "@/components/ProfileInfoCard";
import { JobApplication, JobSeekerProfile } from "@/lib/mockData";
import { profiles } from "@/lib/mockData";

export default function JobSeekerDashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [applications, setApplications] = useState<JobApplication[]>([]);
	const [profile, setProfile] = useState<JobSeekerProfile | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/signin");
		} else if (session?.user) {
			// Fetch profile (mock data)
			const userProfile = profiles.find((p) => p.userId === session.user.id);
			if (userProfile) {
				setProfile(userProfile);
			}

			// Fetch applications (mock data)
			const userApplications: JobApplication[] = [
				{
					id: "1",
					jobId: "1",
					userId: session.user.id,
					status: "pending" as const,
					appliedAt: "2024-02-20",
					job: {
						title: "Frontend Developer",
						company: "Tech Corp",
						location: "Remote",
						type: "full-time",
						salary: "$80,000 - $100,000",
						description: "Looking for a skilled frontend developer...",
					},
				},
				{
					id: "2",
					jobId: "2",
					userId: session.user.id,
					status: "interview" as const,
					appliedAt: "2024-02-19",
					job: {
						title: "Backend Developer",
						company: "Dev Solutions",
						location: "New York",
						type: "full-time",
						salary: "$90,000 - $110,000",
						description: "Seeking an experienced backend developer...",
					},
					interview: {
						date: "2024-03-01",
						time: "14:00",
						type: "online",
						status: "scheduled",
					},
				},
			];
			setApplications(userApplications);
			setIsLoading(false);
		}
	}, [status, session, router]);

	const getStatusColor = (status: JobApplication["status"]) => {
		switch (status) {
			case "pending":
				return "bg-yellow-100 text-yellow-800";
			case "reviewed":
				return "bg-blue-100 text-blue-800";
			case "interview":
				return "bg-purple-100 text-purple-800";
			case "rejected":
				return "bg-red-100 text-red-800";
			case "accepted":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	if (status === "loading" || isLoading) {
		return <div>Loading...</div>;
	}

	if (!profile) {
		return <div>Profile not found</div>;
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Profile Section */}
					<div className="lg:col-span-1">
						<ProfileInfoCard profile={profile} />
					</div>

					{/* Applications Section */}
					<div className="lg:col-span-2">
						<h2 className="text-2xl font-bold text-gray-900 mb-6">
							Your Applications
						</h2>
						<div className="space-y-4">
							{applications.map((application) => (
								<div
									key={application.id}
									className="bg-white shadow rounded-lg p-6"
								>
									<div className="flex justify-between items-start">
										<div>
											<h3 className="text-lg font-semibold text-gray-900">
												{application.job.title}
											</h3>
											<p className="text-gray-600">
												{application.job.company} - {application.job.location}
											</p>
										</div>
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
												application.status
											)}`}
										>
											{application.status.charAt(0).toUpperCase() +
												application.status.slice(1)}
										</span>
									</div>
									<div className="mt-4">
										<p className="text-gray-600">
											Applied on: {new Date(application.appliedAt).toLocaleDateString()}
										</p>
										{application.interview && (
											<div className="mt-2">
												<p className="text-gray-600">
													Interview scheduled for:{" "}
													{new Date(application.interview.date).toLocaleDateString()} at{" "}
													{application.interview.time}
												</p>
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
