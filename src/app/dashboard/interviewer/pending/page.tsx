"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { InterviewRequest } from "@/lib/mockData";
import { interviewRequests } from "@/lib/mockData";

export default function PendingInterviews() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [pendingInterviews, setPendingInterviews] = useState<
		InterviewRequest[]
	>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/auth/signin");
		} else {
			// Filter pending interviews
			const pending = interviewRequests.filter(
				(request) => request.status === "pending"
			);
			setPendingInterviews(pending);
			setIsLoading(false);
		}
	}, [status, router]);

	if (status === "loading" || isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-purple-50 to-teal-50 py-12 px-4 sm:px-6 lg:px-8">
				<div className="max-w-7xl mx-auto">
					<div className="animate-pulse">
						<div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
						<div className="space-y-4">
							{[1, 2, 3].map((i) => (
								<div key={i} className="h-24 bg-gray-200 rounded"></div>
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
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-3xl font-bold text-gray-900">
						Pending Interview Requests
					</h1>
					<button
						onClick={() => router.push("/dashboard/interviewer")}
						className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-700 hover:to-teal-600 shadow-sm"
					>
						Back to Dashboard
					</button>
				</div>

				<div className="space-y-6">
					{pendingInterviews.length > 0 ? (
						pendingInterviews.map((interview) => (
							<div
								key={interview.id}
								className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-900"
							>
								<div className="flex justify-between items-start">
									<div>
										<h2 className="text-xl font-semibold text-gray-900">
											{interview.jobSeekerName}
										</h2>
										<p className="text-gray-600">
											{interview.jobTitle} at {interview.company}
										</p>
										{interview.background && (
											<p className="mt-2 text-sm text-gray-600">
												<strong>Background:</strong> {interview.background}
											</p>
										)}
										{interview.specialNeeds && (
											<p className="mt-1 text-sm text-gray-600">
												<strong>Special Needs:</strong> {interview.specialNeeds}
											</p>
										)}
									</div>
									<div className="flex flex-col items-end space-y-2">
										<span className="px-3 py-1 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
											Pending
										</span>
										<button
											onClick={() => {
												// Handle accept interview
												console.log("Accept interview:", interview.id);
											}}
											className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600"
										>
											Accept Interview
										</button>
									</div>
								</div>
								<div className="mt-4">
									<h3 className="text-sm font-medium text-gray-900">
										Preferred Time Slots:
									</h3>
									<div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4">
										{interview.preferredTimeSlots.map((slot, index) => (
											<div
												key={index}
												className="bg-gray-50 rounded-lg p-3 border border-gray-200"
											>
												<p className="text-sm text-gray-900">
													{new Date(slot.date).toLocaleDateString()}
												</p>
												<p className="text-sm text-gray-600">{slot.time}</p>
											</div>
										))}
									</div>
								</div>
							</div>
						))
					) : (
						<div className="bg-white rounded-xl shadow-lg p-6 border-2 border-blue-900 text-center">
							<p className="text-gray-600">No pending interview requests</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
