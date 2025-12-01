import { NextResponse } from "next/server";
import { pusherServer } from "@/app/lib/pusher";

export async function POST(req: Request) {
    const data = await req.text();
    const [socketId, channelName] = data
        .split("&")
        .map((str) => str.split("=")[1]);

    // For MVP, we allow anyone to join. In production, check session here.
    const authResponse = pusherServer.authorizeChannel(socketId, channelName, {
        user_id: socketId,
        user_info: {
            name: "Guest",
        },
    });

    return NextResponse.json(authResponse);
}
