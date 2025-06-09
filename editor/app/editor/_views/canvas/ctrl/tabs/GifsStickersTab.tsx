"use client";
import React from "react";

type GifsStickersTabProps = {
  addElement?: any;
  renderCanvas?: () => void;
  selectedSceneId?: string;
};

const GifsStickersTab = ({ addElement, renderCanvas, selectedSceneId }: GifsStickersTabProps) => {
  return (
    <div className="p-4">
      GIFs will be added here
    </div>
  );
};

export default GifsStickersTab;
