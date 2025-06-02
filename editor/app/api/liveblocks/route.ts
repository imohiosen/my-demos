"use server";

import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCKS_SECRET_KEY || "",
});

export async function POST(request: Request) {
  const { userId, roomId } = (await request.json()) as {
    userId: string;
    roomId: string;
  };
  try {
    await liveblocks.createRoom(roomId, {
      defaultAccesses: [],
    });
  } catch (error) {
    console.error("Room already exists, continuing: " + roomId );
  }

  const { status, body } = await liveblocks.identifyUser({
    userId,
    groupIds: [],
  });

  await liveblocks.updateRoom(roomId, {
    usersAccesses: {
      userId: ["room:write"],
    },
  });

  return new Response(body, { status });
}
