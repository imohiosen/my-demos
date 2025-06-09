"use client";
import React from "react";

type IllustrationsTabProps = {
  addElement?: any;
  renderCanvas?: () => void;
  selectedSceneId?: string;
};

const IllustrationsTab = ({ addElement, renderCanvas, selectedSceneId }: IllustrationsTabProps) => {
  return (
    <div className="p-4">
      Illustrations will be added here
    </div>
  );
};

export default IllustrationsTab;
