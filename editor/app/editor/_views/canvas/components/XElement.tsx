import { Circle, Rect } from "react-konva";
import XCircle from "./XCircle";
import XRect from "./XRect";
import { DElementProps, Selection } from "@/app/editor/_utils/zustand/konva/types";
import X from "./X";

type Props = DElementProps

const XElement = (props: Props) => {
  console.log("XElement props: ", props.sceneId);

  return (
    props.type === "circle" && <X selection={props as Selection}><Circle {...props}/></X>   ||
    (console.error("Unknown type:  "+ props.type), <Rect width={100} height={100} fill="purple" />)
  );
};



export default XElement