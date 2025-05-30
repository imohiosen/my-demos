"use client";

import React, { useEffect } from "react";
import useStore from "@/lib/store";
import { Room } from "./components/Room";



const App = () => {
  const {
    liveblocks: { enterRoom, leaveRoom },
  } = useStore();


  useEffect(() => {
    enterRoom("room-id");
    return () => {
      leaveRoom("room-id");
    };
  }, [enterRoom, leaveRoom]);

  return <Room />;
};

export default App;