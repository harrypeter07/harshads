"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import UserMenu from "./UserMenu";

export default function AuthHeader() {
	const { data: session } = useSession();

	return (
		<header className="bg-white shadow-sm border-b border-gray-100">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between h-16">
					<div className="flex">
						<Link
							href="/"
							className="flex items-center"
						>
							<span className="text-2xl font-bold gradient-text">JOBIFY</span>
						</Link>
					</div>

					<div className="flex items-center">
						{session ? (
							<UserMenu />
						) : (
							<div className="flex items-center space-x-4">
								<Link
									href="/auth/signin"
									className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
								>
									Sign in
								</Link>
								<Link
									href="/auth/signup"
									className="bg-gradient-to-r from-purple-600 to-teal-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover-gradient shadow-sm"
								>
									Sign up
								</Link>
							</div>
						)}
					</div>
				</div>
			</nav>
		</header>
	);
}
