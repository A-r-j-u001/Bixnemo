import { withAuth } from "next-auth/middleware";

export default withAuth({
    pages: {
        signIn: "/login", // Redirect to our custom login page
    },
});

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/notes/:path*",
        // Add other protected routes here
    ],
};
