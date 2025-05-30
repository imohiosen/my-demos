"use client";

import useStore from "@/lib/store";
import { useEffect } from "react";

export function Room() {

  const text = useStore((state) => state.text);
  const setText = useStore((state) => state.setText);
  const cursor = useStore((state) => state.cursor);
  const others = useStore((state) => state.liveblocks.others);
  const liveblocks = useStore((state) => state.liveblocks.others);
    const setCursor = useStore((state) => state.setCursor);

  useEffect(() => {
    // This effect runs when the component mounts
    // You can perform any setup here, like fetching initial data or subscribing to events
    console.log("Room component mounted");      
    console.log("Current cursor position:", others);
  }, [text, others]);

  const userCount = others.length;
  return (
    <div className="h-full w-full flex items-center justify-center" onPointerMove={(e) => {
      const x = e.clientX;
      const y = e.clientY;
      setCursor({ x, y });
    }}>
    <div className=" h-fit w-fit p-4 bg-white rounded shadow-lg">
      <div>There are {userCount} other user(s) online</div>
      <input 
        type="text" 
        value={text} 
        onChange={(e) => setText(e.target.value)} 
      />
        <div>Cursor position: {cursor?.x}</div>
        <div>Cursor position: {cursor?.y}</div>
        <div>Current cursor position: {JSON.stringify(others.map((other) => other.presence))}</div>
    </div>
    </div>
  );
}