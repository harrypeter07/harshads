"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface AccommodationCategory {
	screenReader?: boolean;
	highContrast?: boolean;
	largeText?: boolean;
	brailleMaterials?: boolean;
	signLanguage?: boolean;
	captioning?: boolean;
	writtenCommunication?: boolean;
	assistiveDevices?: boolean;
	extraTime?: boolean;
	breaks?: boolean;
	quietEnvironment?: boolean;
	assistiveTechnology?: boolean;
}

interface AccommodationsState {
	visualImpairment: AccommodationCategory;
	hearingImpairment: AccommodationCategory;
	cognitiveImpairment: AccommodationCategory;
	physicalImpairment: AccommodationCategory;
}

export default function SpecialNeeds() {
	const { data: session, status } = useSession();
	const router = useRouter();
	const [accommodations, setAccommodations] = useState<AccommodationsState>({
		visualImpairment: {
			screenReader: false,
			highContrast: false,
			largeText: false,
			brailleMaterials: false,
		},
		hearingImpairment: {
			signLanguage: false,
			captioning: false,
			writtenCommunication: false,
			assistiveDevices: false,
		},
		cognitiveImpairment: {
			extraTime: false,
			breaks: false,
			quietEnvironment: false,
			assistiveTechnology: false,
		},
		physicalImpairment: {
			extraTime: false,
			breaks: false,
			quietEnvironment: false,
			assistiveTechnology: false,
		},
	});

	const handleCheckboxChange = (
		category: keyof AccommodationsState,
		accommodation: keyof AccommodationCategory
	) => {
		setAccommodations((prev) => ({
			...prev,
			[category]: {
				...prev[category],
				[accommodation]: !prev[category][accommodation],
			},
		}));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		console.log(accommodations);
	};

	if (status === "loading") {
		return <div>Loading...</div>;
	}

	if (status === "unauthenticated") {
		router.push("/auth/signin");
		return null;
	}

	return (
		<div className="min-h-screen py-8 bg-gray-50">
			<div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
				<h1 className="mb-8 text-3xl font-bold text-gray-900">
					Special Needs Accommodations
				</h1>

				<form onSubmit={handleSubmit} className="space-y-8">
					{Object.entries(accommodations).map(([category, options]) => (
						<div key={category} className="space-y-4">
							<h3 className="text-lg font-medium text-gray-900">
								{category
									.split(/(?=[A-Z])/)
									.map(
										(word: string) =>
											word.charAt(0).toUpperCase() + word.slice(1)
									)
									.join(" ")}
							</h3>
							<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
								{Object.entries(options as AccommodationCategory).map(
									([option, isSelected]: [string, boolean]) => (
										<div key={option} className="flex items-center">
											<input
												type="checkbox"
												id={`${category}-${option}`}
												checked={isSelected}
												onChange={() =>
													handleCheckboxChange(
														category as keyof AccommodationsState,
														option as keyof AccommodationCategory
													)
												}
												className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
											/>
											<label
												htmlFor={`${category}-${option}`}
												className="ml-3 text-sm text-gray-700"
											>
												{option
													.split(/(?=[A-Z])/)
													.map(
														(word: string) =>
															word.charAt(0).toUpperCase() + word.slice(1)
													)
													.join(" ")}
											</label>
										</div>
									)
								)}
							</div>
						</div>
					))}

					<div className="flex justify-end">
						<button
							type="submit"
							className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
						>
							Save Accommodations
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
