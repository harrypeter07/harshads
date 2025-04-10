import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		const token = req.nextauth.token;
		const path = req.nextUrl.pathname;

		// If user is not authenticated, redirect to login
		if (!token) {
			return NextResponse.redirect(new URL("/", req.url));
		}

		// Protect dashboard routes based on role
		if (path.startsWith("/dashboard")) {
			const role = path.split("/")[2]; // /dashboard/role/...
			if (token.role !== role) {
				return NextResponse.redirect(
					new URL(`/dashboard/${token.role}`, req.url)
				);
			}
		}

		// Protect profile routes based on role
		if (path.startsWith("/profile")) {
			const role = path.split("/")[2]; // /profile/role/...
			if (token.role !== role) {
				return NextResponse.redirect(
					new URL(`/profile/${token.role}`, req.url)
				);
			}
		}

		return NextResponse.next();
	},
	{
		callbacks: {
			authorized: ({ token }) => !!token,
		},
	}
);

export const config = {
	matcher: ["/dashboard/:path*", "/profile/:path*"],
};
