import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import bcrypt from "bcryptjs";

interface UpdateData {
	name?: string;
	phone?: string;
	password?: string;
}

export async function GET() {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const mongoose = await connectDB();
		const User =
			mongoose.models.User ||
			mongoose.model(
				"User",
				new mongoose.Schema({
					name: String,
					email: String,
					phone: String,
					password: String,
					role: String,
				})
			);

		const user = await User.findOne(
			{ email: session.user.email },
			{ password: 0 } // Exclude password from the response
		);

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		return NextResponse.json(user);
	} catch (error) {
		console.error("Error fetching user profile:", error);
		return NextResponse.json(
			{ error: "Failed to fetch profile" },
			{ status: 500 }
		);
	}
}

export async function POST(req: Request) {
	try {
		const session = await getServerSession(authOptions);

		if (!session?.user?.email) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const { name, phone, currentPassword, newPassword, confirmPassword } =
			await req.json();
		const mongoose = await connectDB();
		const User =
			mongoose.models.User ||
			mongoose.model(
				"User",
				new mongoose.Schema({
					name: String,
					email: String,
					phone: String,
					password: String,
					role: String,
				})
			);

		const user = await User.findOne({ email: session.user.email });

		if (!user) {
			return NextResponse.json({ error: "User not found" }, { status: 404 });
		}

		// Update basic info
		const updateData: UpdateData = {
			name,
			phone,
		};

		// Handle password change if requested
		if (currentPassword && newPassword && confirmPassword) {
			if (newPassword !== confirmPassword) {
				return NextResponse.json(
					{ error: "New passwords do not match" },
					{ status: 400 }
				);
			}

			const isValidPassword = await bcrypt.compare(
				currentPassword,
				user.password
			);
			if (!isValidPassword) {
				return NextResponse.json(
					{ error: "Current password is incorrect" },
					{ status: 400 }
				);
			}

			const hashedPassword = await bcrypt.hash(newPassword, 10);
			updateData.password = hashedPassword;
		}

		// Update user in database
		await User.findOneAndUpdate(
			{ email: session.user.email },
			{ $set: updateData }
		);

		return NextResponse.json({ message: "Profile updated successfully" });
	} catch (error) {
		console.error("Error updating profile:", error);
		return NextResponse.json(
			{ error: "Failed to update profile" },
			{ status: 500 }
		);
	}
}
