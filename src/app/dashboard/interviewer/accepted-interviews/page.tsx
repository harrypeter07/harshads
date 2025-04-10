"use client";

import { useEffect, useState } from "react";

import axios from "axios";

interface AcceptedInterview {
	_id: string;
	userId: {
		_id: string;
		name: string;
		email: string;
		skills: string[];
		experience: string[];
	};
	jobRole: string;
	timeSlot: string;
	interviewDone: boolean;
	createdAt: string;
}

export default function AcceptedInterviewsPage() {
	const [interviews, setInterviews] = useState<AcceptedInterview[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");

	useEffect(() => {
		const fetchAcceptedInterviews = async () => {
			try {
				const response = await axios.get<AcceptedInterview[]>(
					"/api/interview/accepted"
				);
				setInterviews(response.data);
			} catch (error: unknown) {
				if (error instanceof Error) {
					setError(error.message);
				} else {
					setError("Failed to fetch accepted interviews");
				}
			} finally {
				setLoading(false);
			}
		};

		fetchAcceptedInterviews();
	}, []);

	if (loading) {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-8">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-bold text-gray-900 mb-8">
					Upcoming Interviews
				</h1>

				{error && (
					<div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
						<div className="flex">
							<div className="flex-shrink-0">
								<svg
									className="h-5 w-5 text-red-400"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
							</div>
							<div className="ml-3">
								<p className="text-sm text-red-700">{error}</p>
							</div>
						</div>
					</div>
				)}

				{interviews.length === 0 ? (
					<div className="text-center py-12">
						<p className="text-gray-500 text-lg">
							No upcoming interviews scheduled.
						</p>
					</div>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{interviews.map((interview, index) => (
							<div
								key={interview._id}
								className={`rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden ${
									index % 6 === 0
										? "bg-gradient-to-br from-blue-50 to-blue-100"
										: index % 6 === 1
										? "bg-gradient-to-br from-purple-50 to-purple-100"
										: index % 6 === 2
										? "bg-gradient-to-br from-green-50 to-green-100"
										: index % 6 === 3
										? "bg-gradient-to-br from-pink-50 to-pink-100"
										: index % 6 === 4
										? "bg-gradient-to-br from-yellow-50 to-yellow-100"
										: "bg-gradient-to-br from-indigo-50 to-indigo-100"
								}`}
							>
								<div className="p-6">
									<div className="flex items-center justify-between mb-4">
										<div>
											<h2 className="text-xl font-semibold text-gray-900">
												{interview.userId.name}
											</h2>
											<p className="text-sm text-gray-600">
												{interview.userId.email}
											</p>
										</div>
										<div
											className={`h-12 w-12 rounded-full flex items-center justify-center ${
												index % 6 === 0
													? "bg-blue-100"
													: index % 6 === 1
													? "bg-purple-100"
													: index % 6 === 2
													? "bg-green-100"
													: index % 6 === 3
													? "bg-pink-100"
													: index % 6 === 4
													? "bg-yellow-100"
													: "bg-indigo-100"
											}`}
										>
											<span
												className={`font-semibold text-lg ${
													index % 6 === 0
														? "text-blue-600"
														: index % 6 === 1
														? "text-purple-600"
														: index % 6 === 2
														? "text-green-600"
														: index % 6 === 3
														? "text-pink-600"
														: index % 6 === 4
														? "text-yellow-600"
														: "text-indigo-600"
												}`}
											>
												{interview.userId.name.charAt(0)}
											</span>
										</div>
									</div>

									<div className="space-y-3">
										<div className="flex items-center">
											<svg
												className={`h-5 w-5 mr-2 ${
													index % 6 === 0
														? "text-blue-400"
														: index % 6 === 1
														? "text-purple-400"
														: index % 6 === 2
														? "text-green-400"
														: index % 6 === 3
														? "text-pink-400"
														: index % 6 === 4
														? "text-yellow-400"
														: "text-indigo-400"
												}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
												/>
											</svg>
											<span className="text-sm text-gray-900">
												{interview.jobRole}
											</span>
										</div>

										<div className="flex items-start">
											<svg
												className={`h-5 w-5 mr-2 mt-1 ${
													index % 6 === 0
														? "text-blue-400"
														: index % 6 === 1
														? "text-purple-400"
														: index % 6 === 2
														? "text-green-400"
														: index % 6 === 3
														? "text-pink-400"
														: index % 6 === 4
														? "text-yellow-400"
														: "text-indigo-400"
												}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
												/>
											</svg>
											<div>
												<span className="text-sm font-medium text-gray-500">
													Skills:
												</span>
												<div className="flex flex-wrap gap-2 mt-1">
													{interview.userId.skills.map((skill, skillIndex) => (
														<span
															key={skillIndex}
															className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
																index % 6 === 0
																	? "bg-blue-100 text-blue-800"
																	: index % 6 === 1
																	? "bg-purple-100 text-purple-800"
																	: index % 6 === 2
																	? "bg-green-100 text-green-800"
																	: index % 6 === 3
																	? "bg-pink-100 text-pink-800"
																	: index % 6 === 4
																	? "bg-yellow-100 text-yellow-800"
																	: "bg-indigo-100 text-indigo-800"
															}`}
														>
															{skill}
														</span>
													))}
												</div>
											</div>
										</div>

										<div className="flex items-center">
											<svg
												className={`h-5 w-5 mr-2 ${
													index % 6 === 0
														? "text-blue-400"
														: index % 6 === 1
														? "text-purple-400"
														: index % 6 === 2
														? "text-green-400"
														: index % 6 === 3
														? "text-pink-400"
														: index % 6 === 4
														? "text-yellow-400"
														: "text-indigo-400"
												}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											<span className="text-sm text-gray-900">
												{interview.timeSlot}
											</span>
										</div>

										<div className="flex items-center">
											<svg
												className={`h-5 w-5 mr-2 ${
													index % 6 === 0
														? "text-blue-400"
														: index % 6 === 1
														? "text-purple-400"
														: index % 6 === 2
														? "text-green-400"
														: index % 6 === 3
														? "text-pink-400"
														: index % 6 === 4
														? "text-yellow-400"
														: "text-indigo-400"
												}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth="2"
													d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
												/>
											</svg>
											<span
												className={`text-sm font-medium ${
													interview.interviewDone
														? "text-green-600"
														: "text-yellow-600"
												}`}
											>
												{interview.interviewDone ? "Completed" : "Scheduled"}
											</span>
										</div>
									</div>

									<div className="mt-6">
										{!interview.interviewDone && (
											<button
												onClick={() => {
													// TODO: Implement start interview functionality
													console.log("Start interview:", interview._id);
												}}
												className={`w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
													index % 6 === 0
														? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
														: index % 6 === 1
														? "bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
														: index % 6 === 2
														? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
														: index % 6 === 3
														? "bg-pink-600 hover:bg-pink-700 focus:ring-pink-500"
														: index % 6 === 4
														? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
														: "bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500"
												}`}
											>
												Start Interview
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
