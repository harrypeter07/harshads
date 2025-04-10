"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiBriefcase } from "react-icons/fi";
import {
	inputStyles,
	primaryButtonStyles,
	formContainerStyles,
	labelStyles,
	errorStyles,
} from "@/components/ui/FormStyles";

export default function SignUp() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
		role: "job-seeker",
	});
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		if (formData.password !== formData.confirmPassword) {
			setError("Passwords do not match");
			setLoading(false);
			return;
		}

		try {
			const response = await fetch("/api/auth/signup", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: formData.name,
					email: formData.email,
					password: formData.password,
					role: formData.role,
				}),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Failed to create account");
			}

			// Redirect to sign in page on success
			router.push("/auth/signin");
		} catch (err: any) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
				<div>
					<h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
						Create your account
					</h2>
					<p className="mt-2 text-center text-sm text-gray-600">
						Or{" "}
						<Link
							href="/auth/signin"
							className="font-medium text-indigo-600 hover:text-indigo-500"
						>
							sign in to your account
						</Link>
					</p>
				</div>

				{error && <div className={errorStyles}>{error}</div>}

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label htmlFor="name" className={labelStyles}>
							Full Name
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiUser className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="text"
								id="name"
								value={formData.name}
								onChange={(e) =>
									setFormData({ ...formData, name: e.target.value })
								}
								className={inputStyles + " pl-10"}
								required
							/>
						</div>
					</div>

					<div>
						<label htmlFor="email" className={labelStyles}>
							Email
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiMail className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="email"
								id="email"
								value={formData.email}
								onChange={(e) =>
									setFormData({ ...formData, email: e.target.value })
								}
								className={inputStyles + " pl-10"}
								required
							/>
						</div>
					</div>

					<div>
						<label htmlFor="password" className={labelStyles}>
							Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiLock className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="password"
								id="password"
								value={formData.password}
								onChange={(e) =>
									setFormData({ ...formData, password: e.target.value })
								}
								className={inputStyles + " pl-10"}
								required
							/>
						</div>
					</div>

					<div>
						<label htmlFor="confirmPassword" className={labelStyles}>
							Confirm Password
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiLock className="h-5 w-5 text-gray-400" />
							</div>
							<input
								type="password"
								id="confirmPassword"
								value={formData.confirmPassword}
								onChange={(e) =>
									setFormData({ ...formData, confirmPassword: e.target.value })
								}
								className={inputStyles + " pl-10"}
								required
							/>
						</div>
					</div>

					<div>
						<label htmlFor="role" className={labelStyles}>
							Role
						</label>
						<div className="relative">
							<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
								<FiBriefcase className="h-5 w-5 text-gray-400" />
							</div>
							<select
								id="role"
								value={formData.role}
								onChange={(e) =>
									setFormData({ ...formData, role: e.target.value })
								}
								className={inputStyles + " pl-10"}
								required
							>
								<option value="job-seeker">Job Seeker</option>
								<option value="interviewer">Interviewer</option>
							</select>
						</div>
					</div>

					<div className="mt-6">
						<button
							type="submit"
							disabled={loading}
							className={primaryButtonStyles}
						>
							{loading ? "Creating account..." : "Create account"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
