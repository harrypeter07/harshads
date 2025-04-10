import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import UserModel from "@/models/User";
import Interviewer from "@/models/Interviewer";
import bcrypt from "bcryptjs";

// Extend the built-in session types
declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			role: string;
		};
	}

	interface User {
		id: string;
		email: string;
		role: string;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		role: string;
	}
}

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
				role: { label: "Role", type: "text" },
				isSignUp: { label: "Is Sign Up", type: "boolean" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Please enter an email and password");
				}

				try {
					await connectDB();

					// Check if user exists
					const user = await UserModel.findOne({ email: credentials.email });

					// Handle sign-up flow
					if (credentials.isSignUp === "true") {
						if (!credentials.role) {
							throw new Error("Role is required for sign up");
						}

						if (
							!["job-seeker", "interviewer", "company"].includes(
								credentials.role
							)
						) {
							throw new Error("Invalid role selected");
						}

						if (user) {
							throw new Error("User already exists");
						}

						// Hash password
						const hashedPassword = await bcrypt.hash(credentials.password, 10);

						// Create new user with a specific ID
						const newUser = await UserModel.create({
							email: credentials.email,
							password: hashedPassword,
							role: credentials.role,
						});

						// Only create interviewer profile during signup
						// Company and job seeker profiles will be created later
						if (credentials.role === "interviewer") {
							await Interviewer.create({
								_id: newUser._id,
								userId: newUser._id,
								email: credentials.email,
								firstName: "New",
								lastName: "Interviewer",
								phone: "",
								expertise: [],
								experience: 0,
								company: "",
								position: "",
								availability: [],
							});
						}

						return {
							id: newUser._id.toString(),
							email: newUser.email,
							role: newUser.role,
						};
					}

					// Handle sign-in flow
					if (!user) {
						throw new Error("No user found with this email");
					}

					const isPasswordValid = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isPasswordValid) {
						throw new Error("Invalid password");
					}

					return {
						id: user._id.toString(),
						email: user.email,
						role: user.role,
					};
				} catch (error) {
					console.error("Auth error:", error);
					throw error;
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.role = token.role;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/signin",
		signOut: "/auth/signout",
		error: "/auth/error",
	},
	session: {
		strategy: "jwt",
	},
};
