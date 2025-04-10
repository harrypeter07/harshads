"use client";

import { useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");
	const router = useRouter();
	const { data: session } = useSession();

	// Handle role-based redirection when session changes
	useEffect(() => {
		if (session?.user?.role) {
			router.push(`/profile/${session.user.role}`);
		}
	}, [session, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");

		if (!email || !password) {
			setError("Please fill in email and password");
			return;
		}

		setIsLoading(true);

		try {
			const result = await signIn("credentials", {
				email,
				password,
				redirect: false,
			});

			if (result?.error) {
				setError(result.error);
			}
			// No need for else block - useEffect will handle redirection when session updates
		} catch (error) {
			console.error("Error:", error);
			setError("An unexpected error occurred");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-teal-50">
			{/* Navigation */}
			<nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
									JOBIFY
								</h1>
							</div>
						</div>
						<div className="flex items-center">
							<p className="text-gray-600">
								Don&apos;t have an account?{" "}
								<Link
									href="/auth/signup"
									className="text-purple-600 hover:text-purple-500 font-medium transition-colors duration-200"
								>
									Sign up
								</Link>
							</p>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
				<div className="px-4 py-6 sm:px-0">
					<div className="flex justify-center">
						<div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
							<div>
								<h2 className="mt-6 text-center text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
									Sign in to your account
								</h2>
							</div>

							{error && (
								<div className="rounded-md bg-red-50 p-4">
									<div className="text-sm text-red-700">{error}</div>
								</div>
							)}

							<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
								<div className="rounded-md shadow-sm -space-y-px">
									<div>
										<label htmlFor="email" className="sr-only">
											Email address
										</label>
										<input
											id="email"
											name="email"
											type="email"
											required
											className="appearance-none rounded-t-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm transition-all duration-200"
											placeholder="Email address"
											value={email}
											onChange={(e) => setEmail(e.target.value)}
										/>
									</div>
									<div>
										<label htmlFor="password" className="sr-only">
											Password
										</label>
										<input
											id="password"
											name="password"
											type="password"
											required
											className="appearance-none rounded-b-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm transition-all duration-200"
											placeholder="Password"
											value={password}
											onChange={(e) => setPassword(e.target.value)}
										/>
									</div>
								</div>

								<div>
									<button
										type="submit"
										disabled={isLoading}
										className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 shadow-sm hover:shadow-md transition-all duration-200"
									>
										{isLoading ? "Signing in..." : "Sign in"}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</main>

			{/* Footer */}
			<footer className="bg-white/80 backdrop-blur-sm border-t">
				<div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
					<div className="text-center text-sm text-gray-600">
						<p>© 2024 JOBIFY. All rights reserved.</p>
					</div>
				</div>
			</footer>
		</div>
	);
}

// my comment
