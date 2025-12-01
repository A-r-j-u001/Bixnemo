import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "@/app/lib/db";
import User from "@/app/lib/db/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                console.log("--- Auth Start ---");
                console.time("Auth Total");

                console.time("DB Connect");
                try {
                    await dbConnect();
                } catch (e) {
                    console.error("DB Connect Error:", e);
                    return null;
                }
                console.timeEnd("DB Connect");

                if (!credentials?.email || !credentials?.password) {
                    console.log("Missing credentials");
                    return null;
                }

                console.time("User Find");
                const user = await User.findOne({
                    $or: [
                        { email: credentials.email },
                        { username: credentials.email }
                    ]
                }).select('+password');
                console.timeEnd("User Find");

                if (!user) {
                    console.log("User not found");
                    console.timeEnd("Auth Total");
                    return null;
                }

                console.time("Bcrypt Compare");
                const isValid = await bcrypt.compare(credentials.password, user.password);
                console.timeEnd("Bcrypt Compare");

                if (!isValid) {
                    console.log("Invalid password");
                    console.timeEnd("Auth Total");
                    return null;
                }

                console.timeEnd("Auth Total");
                console.log("--- Auth Success ---");
                return { id: user._id.toString(), name: user.name, email: user.email, image: user.image };
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            await dbConnect();
            if (account?.provider === 'google') {
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    await User.create({
                        name: user.name,
                        email: user.email,
                        image: user.image
                    });
                }
            }
            return true;
        },
        async session({ session, token }) {
            if (session?.user) {
                // session.user.id = token.sub; // Add ID to session if needed
            }
            return session;
        }
    },
    pages: {
        signIn: '/auth/signin',
    },
    secret: process.env.NEXTAUTH_SECRET
};
