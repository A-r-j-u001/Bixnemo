import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/db";
import User from "@/app/lib/db/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
    try {
        await dbConnect();

        const demoUser = {
            name: 'Demo User',
            email: 'demo@bixnemo.com',
            username: 'demobix48',
            password: 'password123',
            image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        };

        const hashedPassword = await bcrypt.hash(demoUser.password, 10);

        let user = await User.findOne({
            $or: [{ email: demoUser.email }, { username: demoUser.username }]
        });

        if (user) {
            user.name = demoUser.name;
            user.email = demoUser.email;
            user.username = demoUser.username;
            user.password = hashedPassword;
            user.image = demoUser.image;
            await user.save();
            return NextResponse.json({ message: "Demo user updated successfully", user: demoUser.username });
        } else {
            await User.create({
                ...demoUser,
                password: hashedPassword
            });
            return NextResponse.json({ message: "Demo user created successfully", user: demoUser.username });
        }

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
