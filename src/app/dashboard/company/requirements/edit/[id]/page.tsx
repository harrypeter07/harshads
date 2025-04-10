"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CompanyRequirementForm from "@/components/CompanyRequirementForm";

export default function EditCompanyRequirements() {
	const params = useParams();
	const [requirement, setRequirement] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchRequirement = async () => {
			try {
				const response = await fetch(`/api/company/requirements/${params.id}`);
				if (response.ok) {
					const data = await response.json();
					setRequirement(data);
				} else {
					console.error("Failed to fetch requirement");
				}
			} catch (error) {
				console.error("Error:", error);
			} finally {
				setIsLoading(false);
			}
		};

		if (params.id) {
			fetchRequirement();
		}
	}, [params.id]);

	if (isLoading) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
			</div>
		);
	}

	return (
		<div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
			<h1 className="text-2xl font-bold text-gray-900 mb-8">
				Edit Company Requirements
			</h1>
			{requirement && (
				<CompanyRequirementForm initialData={requirement} isEditing={true} />
			)}
		</div>
	);
}
