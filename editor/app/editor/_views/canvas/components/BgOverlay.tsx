import React from "react";
import { Rect } from "react-konva";

// Constants
const CANVAS_WIDTH = 1920;
const CANVAS_HEIGHT = 1080;
const OVERLAY_MULTIPLIER = 5;

const BgOverlay = () => (
  <>
    {/* Top overlay */}
    <Rect
      x={-CANVAS_WIDTH * OVERLAY_MULTIPLIER}
      y={-CANVAS_HEIGHT * OVERLAY_MULTIPLIER}
      width={CANVAS_WIDTH * OVERLAY_MULTIPLIER * 2}
      height={CANVAS_HEIGHT * OVERLAY_MULTIPLIER - CANVAS_HEIGHT / 2}
      fill="rgba(196, 196, 196, 0.1)"
      listening={false}
    />

    {/* Bottom overlay */}
    <Rect
      x={-CANVAS_WIDTH * OVERLAY_MULTIPLIER}
      y={CANVAS_HEIGHT / 2}
      width={CANVAS_WIDTH * OVERLAY_MULTIPLIER * 2}
      height={CANVAS_HEIGHT * OVERLAY_MULTIPLIER}
      fill="rgba(196, 196, 196, 0.1)"
      listening={false}
    />

    {/* Left overlay */}
    <Rect
      x={-CANVAS_WIDTH * OVERLAY_MULTIPLIER}
      y={-CANVAS_HEIGHT / 2}
      width={CANVAS_WIDTH * OVERLAY_MULTIPLIER - CANVAS_WIDTH / 2}
      height={CANVAS_HEIGHT}
      fill="rgba(196, 196, 196, 0.1)"
      listening={false}
    />

    {/* Right overlay */}
    <Rect
      x={CANVAS_WIDTH / 2}
      y={-CANVAS_HEIGHT / 2}
      width={CANVAS_WIDTH * OVERLAY_MULTIPLIER}
      height={CANVAS_HEIGHT}
      fill="rgba(196, 196, 196, 0.1)"
      listening={false}
    />
  </>
);

export default BgOverlay;
