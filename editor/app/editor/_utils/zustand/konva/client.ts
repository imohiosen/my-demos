import { createClient } from "@liveblocks/client";

export const client = createClient({
  authEndpoint: async (roomId?) => {
    const response = await fetch("/api/liveblocks", {
      method: "POST",
      headers: {
        Authentication: "token",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: "ab-01", roomId }),
    });

    return await response.json(); // should be: { token: "..." }
  },
});
