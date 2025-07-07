"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import React from "react";
import Image from "next/image";
import { useCanvasEditorStore, usePresenceStore } from "@/app/editor/_utils/zustand/konva";


type Props = {
  // Add any props you need here
  children?: React.ReactNode;
  className?: string;
};

const AddAvatar = (props: Props) => {
  return (
    <div className={props.className}>
      <Popover>
        <PopoverTrigger asChild>{props.children}</PopoverTrigger>
        <PopoverContent className="w-80 h-80">
          <div className="banner">
            <div className="left">
              <div className="">Create your own avatar</div>
              <div className="">
                Create a lifelike avatar to bring your script to life.
              </div>
              <Button variant="default" size={"lg"}>
                Create Avatar
              </Button>
            </div>
            <div className="right"></div>
          </div>
          <div className="content">
            <div className="tab-header"></div>
            <div className="tab-content">
              <div className="search">
                <input
                  type="text"
                  placeholder="Search for an avatar"
                  className="w-full h-10 px-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="avatar">

                <Image
                  src="https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/262658a5bb3346e38b68c623019fd5b2_55470/preview_target.webp"
                  alt="Avatar"
                  width={100}
                  height={100}
                  onClick={() => {
                    // Handle avatar selection
                    useCanvasEditorStore.getState().addAvatar({
                      sceneId: usePresenceStore.getState().selectedStageId!,
                      componentId: `avatar-${Date.now()}`,
                      type: "avatar",
                      avatar: {
                        attribute: {
                          x: 0,
                          y: 0,
                          width: 100,
                          height: 100,
                          src: "https://dynamic.heygen.ai/tr:h-720,c-at_max/avatar/v3/262658a5bb3346e38b68c623019fd5b2_55470/preview_target.webp",
                          alt: "Avatar",
                        },
                      },
                    });
                  }}
                  className="cursor-pointer rounded-lg hover:shadow-lg transition-shadow duration-200"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AddAvatar;
