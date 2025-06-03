import { Rect } from "react-konva";
import { Selection } from "../../../_utils/zustand/konva/store";
import { useCanvasEditorStore } from "@/app/editor/_utils/zustand/konva/impl";
type Props =  {
  shouldDisplay: boolean;
  selection: Selection;
};

const XSelection = (props: Props) => {

  const getComponentBoundingRect = useCanvasEditorStore(state => state.getComponentBoundingRect);

  if (!props.shouldDisplay) 
    return null;
  return (
    <Rect
          {...componentBoundingRect(props.selection)}
          fill="transparent"
          stroke="red"
          strokeWidth={4}
          draggable={false}
          listening={false}
          perfectDrawEnabled={false}
        />
  );
};

export default XSelection;