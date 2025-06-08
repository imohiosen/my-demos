import CanvasHeaderCtrl from "./CanvasHeaderCtrl";
import { Button } from "@/components/ui/button";
import { RectangleHorizontal, RectangleVertical } from "lucide-react";
import CanvasView from "./CanvasContentView";
import UndoRedoCtrl from "./UndoRedoCtrl";
import CanvasSelectionCtrl from "../../_components/edit-pane/CanvasSelectionCtrl";

type Props = {};

const CanvasView = (props: Props) => {

  

  return (
    <div className="flex flex-col h-full w-full p-4 relative">
      <CanvasSelectionCtrl className='absolute w-full h-24 bg-white/10 backdrop-blur-xs' />
      <div className="flex flex-row items-center justify-between">
        <UndoRedoCtrl />
        <CanvasHeaderCtrl />
        <div className="flex flex-row items-center gap-0.5">
          <Button variant={"ghost"}>
            <RectangleVertical />
          </Button>
          <Button variant={"ghost"}>
            <RectangleHorizontal />
          </Button>
        </div>
      </div>
      <div className="h-full overflow-hidden flex flex-col gap-2 justify-center items-center bg-transparent">
        <CanvasView />
      </div>
    </div>
  );
};

export default CanvasView;


