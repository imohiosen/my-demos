"use client";
import { Button } from "@/components/ui/button";
import { LucideRedo2, LucideSave, LucideUndo2 } from "lucide-react";
import { useCanvasStore } from "../../_utils/zustand/canvas/canvasStore";


function UndoRedoCtrl() {
  const { undo, redo, saveState } = useCanvasStore();

    return <div className="flex flex-row items-center gap-0.5 text-secondary">
      <Button variant={"secondary"} onClick={undo}>
        <LucideUndo2 />
      </Button>
      <Button variant={"secondary"} onClick={saveState}>
        <LucideSave />
      </Button>
      <Button variant={"secondary"} onClick={redo}>
        <LucideRedo2 />
      </Button>
    </div>;
}
export default UndoRedoCtrl;    