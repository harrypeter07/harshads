/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
	inputStyles,
	labelStyles,
	primaryButtonStyles,
	formContainerStyles,
	formTitleStyles,
	formGroupStyles,
	errorStyles,
	successStyles,
	
	sectionStyles,
	sectionTitleStyles,
	
} from "@/components/ui/FormStyles";

interface InterviewerProfile {
	firstName: string;
	lastName: string;
	phone: string;
	expertise: string[];
	experience: number;
	company: string;
	position: string;
	availability: Array<{
		day: string;
		startTime: string;
		endTime: string;
	}>;
}

export default function InterviewerProfile() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");
	const [profile, setProfile] = useState<InterviewerProfile>({
		firstName: "",
		lastName: "",
		phone: "",
		expertise: [],
		experience: 0,
		company: "",
		position: "",
		availability: [],
	});
	const [expertiseInput, setExpertiseInput] = useState("");
	const [success, setSuccess] = useState("");

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push("/");
		} else if (session?.user) {
			fetchProfile();
		}
	}, [status, session, router]);

	const fetchProfile = async () => {
		try {
			const response = await fetch("/api/profile/interviewer");
			if (response.ok) {
				const data = await response.json();
				setProfile(data);
				setExpertiseInput(data.expertise.join(", "));
			}
		} catch (error) {
			console.error("Error fetching profile:", error);
			setError("Failed to load profile");
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setIsSubmitting(true);

		try {
			const response = await fetch("/api/profile/interviewer", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...profile,
					expertise: expertiseInput,
				}),
			});

			if (response.ok) {
				router.push("/dashboard/interviewer");
			} else {
				const data = await response.json();
				setError(data.error || "Failed to update profile");
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			setError("Failed to update profile");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleAvailabilityChange = (
		index: number,
		field: "day" | "startTime" | "endTime",
		value: string
	) => {
		const newAvailability = [...profile.availability];
		newAvailability[index] = {
			...newAvailability[index],
			[field]: value,
		};
		setProfile({ ...profile, availability: newAvailability });
	};

	const addAvailability = () => {
		setProfile({
			...profile,
			availability: [
				...profile.availability,
				{ day: "", startTime: "", endTime: "" },
			],
		});
	};

	const removeAvailability = (index: number) => {
		const newAvailability = profile.availability.filter((_, i) => i !== index);
		setProfile({ ...profile, availability: newAvailability });
	};

	if (status === "loading") {
		return (
			<div className="min-h-screen bg-gray-50 flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50 py-12">
			<div className={formContainerStyles}>
				<h1 className={formTitleStyles}>Interviewer Profile</h1>

				{error && <div className={errorStyles}>{error}</div>}
				{success && <div className={successStyles}>{success}</div>}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div className={formGroupStyles}>
						<label htmlFor="firstName" className={labelStyles}>
							First Name
						</label>
						<input
							type="text"
							id="firstName"
							value={profile.firstName}
							onChange={(e) =>
								setProfile({ ...profile, firstName: e.target.value })
							}
							className={inputStyles}
							required
						/>
					</div>

					<div className={formGroupStyles}>
						<label htmlFor="lastName" className={labelStyles}>
							Last Name
						</label>
						<input
							type="text"
							id="lastName"
							value={profile.lastName}
							onChange={(e) =>
								setProfile({ ...profile, lastName: e.target.value })
							}
							className={inputStyles}
							required
						/>
					</div>

					<div className={formGroupStyles}>
						<label htmlFor="phone" className={labelStyles}>
							Phone Number
						</label>
						<input
							type="tel"
							id="phone"
							value={profile.phone}
							onChange={(e) =>
								setProfile({ ...profile, phone: e.target.value })
							}
							className={inputStyles}
						/>
					</div>

					<div className={formGroupStyles}>
						<label htmlFor="expertise" className={labelStyles}>
							Expertise (comma-separated)
						</label>
						<input
							type="text"
							id="expertise"
							value={expertiseInput}
							onChange={(e) => setExpertiseInput(e.target.value)}
							className={inputStyles}
							placeholder="e.g., JavaScript, React, Node.js"
						/>
					</div>

					<div className={formGroupStyles}>
						<label htmlFor="experience" className={labelStyles}>
							Years of Experience
						</label>
						<input
							type="number"
							id="experience"
							value={profile.experience}
							onChange={(e) =>
								setProfile({ ...profile, experience: parseInt(e.target.value) })
							}
							className={inputStyles}
							min="0"
							required
						/>
					</div>

					<div className={formGroupStyles}>
						<label htmlFor="company" className={labelStyles}>
							Company
						</label>
						<input
							type="text"
							id="company"
							value={profile.company}
							onChange={(e) =>
								setProfile({ ...profile, company: e.target.value })
							}
							className={inputStyles}
						/>
					</div>

					<div className={formGroupStyles}>
						<label htmlFor="position" className={labelStyles}>
							Position
						</label>
						<input
							type="text"
							id="position"
							value={profile.position}
							onChange={(e) =>
								setProfile({ ...profile, position: e.target.value })
							}
							className={inputStyles}
						/>
					</div>

					<div className={sectionStyles}>
						<h2 className={sectionTitleStyles}>Availability</h2>
						{profile.availability.map((slot, index) => (
							<div
								key={index}
								className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4"
							>
								<div>
									<label className={labelStyles}>Day</label>
									<select
										value={slot.day}
										onChange={(e) =>
											handleAvailabilityChange(index, "day", e.target.value)
										}
										className={inputStyles}
									>
										<option value="">Select Day</option>
										<option value="Monday">Monday</option>
										<option value="Tuesday">Tuesday</option>
										<option value="Wednesday">Wednesday</option>
										<option value="Thursday">Thursday</option>
										<option value="Friday">Friday</option>
										<option value="Saturday">Saturday</option>
										<option value="Sunday">Sunday</option>
									</select>
								</div>
								<div>
									<label className={labelStyles}>Start Time</label>
									<input
										type="time"
										value={slot.startTime}
										onChange={(e) =>
											handleAvailabilityChange(
												index,
												"startTime",
												e.target.value
											)
										}
										className={inputStyles}
									/>
								</div>
								<div>
									<label className={labelStyles}>End Time</label>
									<input
										type="time"
										value={slot.endTime}
										onChange={(e) =>
											handleAvailabilityChange(index, "endTime", e.target.value)
										}
										className={inputStyles}
									/>
								</div>
								<div className="flex items-end">
									<button
										type="button"
										onClick={() => removeAvailability(index)}
										className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
									>
										Remove
									</button>
								</div>
							</div>
						))}
						<button
							type="button"
							onClick={addAvailability}
							className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
						>
							Add Time Slot
						</button>
					</div>

					<button
						type="submit"
						className={primaryButtonStyles}
						disabled={isSubmitting}
					>
						{isSubmitting ? "Saving..." : "Save Profile"}
					</button>
				</form>
			</div>
		</div>
	);
}
