import { ScrollArea } from "@/components/ui/scroll-area";
import Navbar from "./_views/navbar/Navbar";
import Playback from "./_views/playback/Playback";
import Transcript from "./_views/transcript/Transcript";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import CanvasView from "./_views/canvas/CanvasView";
import CanvasContextMenu from "./_components/context-menus/CanvasContextMenu";

export default function Page() {
  return (
    <>
      <CanvasContextMenu /> 
      <div className="h-screen w-screen bg-secondary p-2 flex flex-col gap-2">
        <div className="h-[72px] overflow-hidden">
          <Navbar />
        </div>

        <ResizablePanelGroup direction="horizontal" className="h-fit space-x-1">
          <ResizablePanel defaultSize={30} minSize={30} maxSize={50}>
            <ScrollArea className="h-full">
              <Transcript />
            </ScrollArea>
          </ResizablePanel>
          <ResizableHandle className=" opacity-0"/>
          <ResizablePanel defaultSize={70} minSize={30} >
            <div  className="h-full space-y-1 flex flex-col overflow-x-hidden overflow-y-hidden">
              <div  className=" flex-1 overflow-hidden">
                <CanvasView />
              </div>
                <div className="h-[160px] m-0 p-0 "> 
                <Playback />
                </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </>
  );
}
