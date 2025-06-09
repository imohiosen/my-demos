"use client";
import React from "react";
import IconButton from "../buttons/IconButton";

type IconsTabProps = {
  addElement?: any;
  renderCanvas?: () => void;
  selectedSceneId?: string;
};

const IconsTab = ({ addElement, renderCanvas, selectedSceneId }: IconsTabProps) => {
  return (
    <div className="">
      <div>
        <div className="grid grid-cols-5 gap-2">
          <IconButton />
        </div>
      </div>
    </div>
  );
};

export default IconsTab;
