"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditJobSeekerProfile() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		phone: "",
		skills: "",
		experience: [
			{
				company: "",
				position: "",
				startDate: "",
				endDate: "",
				description: "",
			},
		],
		education: [
			{ institution: "", degree: "", field: "", startDate: "", endDate: "" },
		],
		resume: "",
	});

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		} else if (session?.user) {
			fetchProfile();
		}
	}, [status, session, router]);

	const fetchProfile = async () => {
		try {
			const response = await fetch("/api/profile/job-seeker");
			if (response.ok) {
				const data = await response.json();
				setFormData({
					...data,
					skills: data.skills?.join(", ") || "",
				});
			}
		} catch (error) {
			console.error("Error fetching profile:", error);
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/profile/job-seeker", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(formData),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.message || "Failed to update profile");
			}

			// Redirect to dashboard on success
			router.push("/dashboard/job-seeker");
			router.refresh(); // Refresh the page to show updated data
		} catch (err: any) {
			setError(err.message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const addExperience = () => {
		setFormData({
			...formData,
			experience: [
				...formData.experience,
				{
					company: "",
					position: "",
					startDate: "",
					endDate: "",
					description: "",
				},
			],
		});
	};

	const addEducation = () => {
		setFormData({
			...formData,
			education: [
				...formData.education,
				{ institution: "", degree: "", field: "", startDate: "", endDate: "" },
			],
		});
	};

	if (status === "loading") {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<h2 className="text-3xl font-extrabold text-gray-900">
						Edit Job Seeker Profile
					</h2>
					<button
						onClick={() => router.push("/profile/job-seeker")}
						className="text-indigo-600 hover:text-indigo-500"
					>
						Cancel
					</button>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
						<div>
							<label className="block text-sm font-medium text-gray-700">
								First Name
							</label>
							<input
								type="text"
								required
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								value={formData.firstName}
								onChange={(e) =>
									setFormData({ ...formData, firstName: e.target.value })
								}
							/>
						</div>
						<div>
							<label className="block text-sm font-medium text-gray-700">
								Last Name
							</label>
							<input
								type="text"
								required
								className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
								value={formData.lastName}
								onChange={(e) =>
									setFormData({ ...formData, lastName: e.target.value })
								}
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Phone
						</label>
						<input
							type="tel"
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							value={formData.phone}
							onChange={(e) =>
								setFormData({ ...formData, phone: e.target.value })
							}
						/>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Skills (comma-separated)
						</label>
						<input
							type="text"
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							value={formData.skills}
							onChange={(e) =>
								setFormData({ ...formData, skills: e.target.value })
							}
							placeholder="e.g., JavaScript, React, Node.js"
						/>
					</div>

					<div>
						<div className="flex justify-between items-center">
							<label className="block text-sm font-medium text-gray-700">
								Experience
							</label>
							<button
								type="button"
								onClick={addExperience}
								className="text-sm text-indigo-600 hover:text-indigo-500"
							>
								Add Experience
							</button>
						</div>
						{formData.experience.map((exp, index) => (
							<div key={index} className="mt-4 space-y-4 border p-4 rounded-md">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Company
										</label>
										<input
											type="text"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											value={exp.company}
											onChange={(e) => {
												const newExperience = [...formData.experience];
												newExperience[index] = {
													...exp,
													company: e.target.value,
												};
												setFormData({ ...formData, experience: newExperience });
											}}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Position
										</label>
										<input
											type="text"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											value={exp.position}
											onChange={(e) => {
												const newExperience = [...formData.experience];
												newExperience[index] = {
													...exp,
													position: e.target.value,
												};
												setFormData({ ...formData, experience: newExperience });
											}}
										/>
									</div>
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Start Date
										</label>
										<input
											type="date"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											value={exp.startDate}
											onChange={(e) => {
												const newExperience = [...formData.experience];
												newExperience[index] = {
													...exp,
													startDate: e.target.value,
												};
												setFormData({ ...formData, experience: newExperience });
											}}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											End Date
										</label>
										<input
											type="date"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											value={exp.endDate}
											onChange={(e) => {
												const newExperience = [...formData.experience];
												newExperience[index] = {
													...exp,
													endDate: e.target.value,
												};
												setFormData({ ...formData, experience: newExperience });
											}}
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Description
									</label>
									<textarea
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
										rows={3}
										value={exp.description}
										onChange={(e) => {
											const newExperience = [...formData.experience];
											newExperience[index] = {
												...exp,
												description: e.target.value,
											};
											setFormData({ ...formData, experience: newExperience });
										}}
									/>
								</div>
							</div>
						))}
					</div>

					<div>
						<div className="flex justify-between items-center">
							<label className="block text-sm font-medium text-gray-700">
								Education
							</label>
							<button
								type="button"
								onClick={addEducation}
								className="text-sm text-indigo-600 hover:text-indigo-500"
							>
								Add Education
							</button>
						</div>
						{formData.education.map((edu, index) => (
							<div key={index} className="mt-4 space-y-4 border p-4 rounded-md">
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Institution
										</label>
										<input
											type="text"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											value={edu.institution}
											onChange={(e) => {
												const newEducation = [...formData.education];
												newEducation[index] = {
													...edu,
													institution: e.target.value,
												};
												setFormData({ ...formData, education: newEducation });
											}}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Degree
										</label>
										<input
											type="text"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											value={edu.degree}
											onChange={(e) => {
												const newEducation = [...formData.education];
												newEducation[index] = {
													...edu,
													degree: e.target.value,
												};
												setFormData({ ...formData, education: newEducation });
											}}
										/>
									</div>
								</div>
								<div>
									<label className="block text-sm font-medium text-gray-700">
										Field of Study
									</label>
									<input
										type="text"
										className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
										value={edu.field}
										onChange={(e) => {
											const newEducation = [...formData.education];
											newEducation[index] = {
												...edu,
												field: e.target.value,
											};
											setFormData({ ...formData, education: newEducation });
										}}
									/>
								</div>
								<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
									<div>
										<label className="block text-sm font-medium text-gray-700">
											Start Date
										</label>
										<input
											type="date"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											value={edu.startDate}
											onChange={(e) => {
												const newEducation = [...formData.education];
												newEducation[index] = {
													...edu,
													startDate: e.target.value,
												};
												setFormData({ ...formData, education: newEducation });
											}}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700">
											End Date
										</label>
										<input
											type="date"
											className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
											value={edu.endDate}
											onChange={(e) => {
												const newEducation = [...formData.education];
												newEducation[index] = {
													...edu,
													endDate: e.target.value,
												};
												setFormData({ ...formData, education: newEducation });
											}}
										/>
									</div>
								</div>
							</div>
						))}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							Resume URL
						</label>
						<input
							type="url"
							className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
							value={formData.resume}
							onChange={(e) =>
								setFormData({ ...formData, resume: e.target.value })
							}
							placeholder="https://example.com/your-resume.pdf"
						/>
					</div>

					<div className="flex justify-end space-x-4">
						<button
							type="button"
							onClick={() => router.push("/profile/job-seeker")}
							className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
						>
							Cancel
						</button>
						<button
							type="submit"
							className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							disabled={isSubmitting}
						>
							{isSubmitting ? "Saving..." : "Save Changes"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
