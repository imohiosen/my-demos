"use client";
import React from "react";
import CircleButton from "../buttons/CircleButton";
import RectangleButton from "../buttons/RectangleButton";
import SquareButton from "../buttons/SquareButton";
import TriangleButton from "../buttons/TriangleButton";
import LineButton from "../buttons/LineButton";
import ArrowButton from "../buttons/ArrowButton";
import HollowCircleButton from "../buttons/HollowCircleButton";
import HollowRectangleButton from "../buttons/HollowRectangleButton";
import HollowSquareButton from "../buttons/HollowSquareButton";
import HollowTriangleButton from "../buttons/HollowTriangleButton";

type ShapesTabProps = {
  addElement: any;
  renderCanvas: () => void;
  selectedSceneId: string;
};

const ShapesTab = ({ addElement, renderCanvas, selectedSceneId }: ShapesTabProps) => {
  return (
    <div className="">
      <div>
        <div className="grid grid-cols-5 gap-2">
          <CircleButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
          <RectangleButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
          <SquareButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
          <TriangleButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
          <HollowCircleButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
          <HollowRectangleButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
          <HollowSquareButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
          <HollowTriangleButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
          <LineButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
          <ArrowButton
            insertFn={addElement}
            postClick={renderCanvas}
            selectedSceneId={selectedSceneId}
          />
        </div>
      </div>
    </div>
  );
};

export default ShapesTab;
