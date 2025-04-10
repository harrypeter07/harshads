"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import ProfileInfoCard from "@/components/ProfileInfoCard";

export default function InterviewerDashboard() {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/signin");
		}
	}, [status, router]);

	if (status === "loading") {
		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8">
					<h1 className="text-3xl font-bold text-gray-900">Welcome back, {session?.user?.name || "Interviewer"}!</h1>
					<p className="mt-2 text-gray-600">Manage your interviews and availability</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<div className="lg:col-span-2">
						<div className="bg-white rounded-xl shadow-lg p-6 mb-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">Upcoming Interviews</h2>
							<div className="space-y-4">
								<p className="text-gray-600">No upcoming interviews</p>
								<button 
									onClick={() => router.push("/dashboard/interviewer/accepted-interviews")}
									className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover-gradient shadow-sm"
								>
									View Schedule
								</button>
							</div>
						</div>

						<div className="bg-white rounded-xl shadow-lg p-6">
							<h2 className="text-xl font-semibold text-gray-900 mb-4">Interview Requests</h2>
							<div className="space-y-4">
								<p className="text-gray-600">No pending requests</p>
								<button 
									onClick={() => router.push("/dashboard/interviewer/candidates")}
									className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover-gradient shadow-sm"
								>
									Manage Requests
								</button>
							</div>
						</div>
					</div>

					<div>
						<ProfileInfoCard
							profile={{
								role: "interviewer",
								name: session?.user?.name || "",
								email: session?.user?.email || "",
							}}
							isLoading={false}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
