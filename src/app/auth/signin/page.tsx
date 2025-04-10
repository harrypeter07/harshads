"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError("");
		setLoading(true);

		try {
			const result = await signIn("credentials", {
				email,
				password,
				isSignUp: "false",
				redirect: false,
			});

			if (result?.error) {
				setError(result.error);
			} else {
				// Get the user's role from the session
				const response = await fetch("/api/auth/session");
				const session = await response.json();
				const userRole = session?.user?.role;

				if (userRole) {
					router.push(`/dashboard/${userRole}`);
				} else {
					setError("Error: User role not found");
				}
			}
		} catch (error) {
			console.error("Error:", error);
			setError("An unexpected error occurred");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center">
			<div className="form-container">
				<h2 className="form-title">Sign in to your account</h2>
				<p className="form-subtitle">
					Or{" "}
					<Link href="/auth/signup" className="nav-link">
						create a new account
					</Link>
				</p>

				{error && <div className="form-error">{error}</div>}

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email" className="form-label">
							Email address
						</label>
						<input
							id="email"
							name="email"
							type="email"
							required
							className="form-input"
							placeholder="Email address"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="password" className="form-label">
							Password
						</label>
						<input
							id="password"
							name="password"
							type="password"
							required
							className="form-input"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<button
						type="submit"
						className="form-button"
						disabled={loading}
					>
						{loading ? "Signing in..." : "Sign in"}
					</button>
				</form>
			</div>
		</div>
	);
}
