"use client";

import {create} from "zustand";
import { createClient } from "@liveblocks/client";
import { liveblocks } from "@liveblocks/zustand";
import type { WithLiveblocks } from "@liveblocks/zustand";

type State = {
  text: string;
  setText: (text: string) => void;
  cursor?: { x: number; y: number };
  setCursor: (cursor: { x: number; y: number }) => void;
};

const client = createClient({
    publicApiKey: "pk_dev_7NjVi0ycMqKpfqN6eyhfpDVAt7m8uktB2Q8n2tc8uOe7R0HX_2OBqOeK8BzgGvUr"
});

const useStore = create<WithLiveblocks<State>>()(
  liveblocks(
    (set) => ({
      text: "",
      cursor: { x: 0, y: 0 },
      setText: (text: string) => set({ text }),
      setCursor: (cursor: { x: number; y: number }) => set({ cursor }),
    }),
    { client,
      storageMapping: {
        text: true,
      },
      presenceMapping: {
        // Define presence properties here if needed
        cursor: true,
      },
    })
);

export default useStore;