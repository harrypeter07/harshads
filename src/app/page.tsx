"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
	const router = useRouter();
	const { data: session, status } = useSession();

	useEffect(() => {
		if (session?.user?.role) {
			router.push(`/profile/${session.user.role}`);
		}
	}, [session, router]);

	if (status === "loading") {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
			</div>
		);
	}

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
						<div className="flex items-center space-x-4">
							<Link
								href="/auth/signin"
								className="text-purple-600 hover:text-purple-500 font-medium transition-colors duration-200"
							>
								Sign in
							</Link>
							<Link
								href="/auth/signup"
								className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-500 transition-colors duration-200"
							>
								Sign up
							</Link>
						</div>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<main className="max-w-7xl mx-auto py-12 sm:px-6 lg:px-8">
				<div className="text-center space-y-8">
					<h1 className="text-4xl font-extrabold sm:text-5xl md:text-6xl">
						<span className="block text-gray-900">Find your next</span>
						<span className="block bg-gradient-to-r from-purple-600 to-teal-600 bg-clip-text text-transparent">
							opportunity
						</span>
					</h1>
					<p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
						Connect with top companies and recruiters. Your next career move
						starts here.
					</p>
					<div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
						<div className="rounded-md shadow">
							<Link
								href="/auth/signup"
								className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-teal-600 hover:from-purple-700 hover:to-teal-700 md:py-4 md:text-lg md:px-10"
							>
								Get started
							</Link>
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
