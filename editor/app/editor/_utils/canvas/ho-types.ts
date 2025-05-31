import { FabricObject } from "fabric";


export interface CanvasEventData {
    e: PointerEvent;
    target: FabricObject;
    subTargets: FabricObject[];
}
