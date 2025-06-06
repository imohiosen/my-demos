import { Rect } from "react-konva";
import XCircle from "./XCircle";
import XRect from "./XRect";
import { DElementProps } from "@/app/editor/_utils/zustand/konva/types";

type Props = DElementProps

const XElement = (props: Props) => {

  return (
    props.type === "circle" && <XCircle  {...props} /> ||
    props.type === "rectangle" && <XRect {...props} /> ||
    (console.error("Unknown type:  "+ props.type), <Rect width={100} height={100} fill="purple" />)
  );
};



export default XElement