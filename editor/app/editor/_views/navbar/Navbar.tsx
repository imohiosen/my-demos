import { Button } from "@/components/ui/button";
import EditorOptionsCtrl from "./EditorOptionsCtrl";
import { LucideArrowLeft, LucideUploadCloud } from "lucide-react";
import { Card } from "@/components/ui/card";
import FeedbackCtrl from "./FeedbackCtrl";
import HistoryCtrl from "./HistoryCtrl";
import PreviewCtrl from "./PreviewCtrl";
import GenerateCtrl from "./GenerateCtrl";
import HelpCtrl from "./HelpCtrl";
import BrandKitSelectionCtrl from "./BrandKitSelectionCtrl";

type Props = {};

const Navbar = (props: Props) => {
  return (
    <>
      <Card className="p-0 m-0 w-full flex flex-row justify-between px-4 items-center h-full">
          <div className="flex flex-row items-center gap-2">
            <Button variant={"ghost"} size={"icon"}>
              <LucideArrowLeft />
            </Button>
            <EditorOptionsCtrl />
            <Button variant={"ghost"} size={"icon"}>
              <LucideUploadCloud />
            </Button>
            <BrandKitSelectionCtrl />
            <HelpCtrl />
            <FeedbackCtrl />
          </div>
          <div className="flex flex-row items-center gap-2">
            <HistoryCtrl />
            <PreviewCtrl />
            <GenerateCtrl />
          </div>
      </Card>
      {/* <div className='bg-white h-16 w-full border-gray-200 border flex items-center px-8 py-2' >
    </div> */}

      {/* backbutton */}
      {/* upload sync indicator */}
      {/* <BrandKitSelectionCtrl />
    <HelpCtrl />
    <FeedbackCtrl />

    <HistoryCtrl />
    <PreviewCtrl />
    <GenerateCtrl /> */}
    </>
  );
};

export default Navbar;
