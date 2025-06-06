import React from "react";
import { Group, Rect } from "react-konva";
import BgOverlay from "./BgOverlay";

// Constants
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;

const CanvasBackground = () => (
  <Group listening={false}>
    {/* Main canvas background */}
    <Rect
      x={0}
      y={0}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      fill="transparent"
      stroke="transparent"
      offsetX={CANVAS_WIDTH / 2}
      offsetY={CANVAS_HEIGHT / 2}
    />

    <BgOverlay />
  </Group>
);

export default CanvasBackground;
