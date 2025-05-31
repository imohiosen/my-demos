import { Button } from "@/components/ui/button";
import { AlignJustify, LucideList, LucideListMinus, LucideOption } from "lucide-react";
import React from "react";

type Props = {};

const EditorOptionsCtrl = (props: Props) => {
  return (
    <>
    <Button variant={"ghost"} size="icon">
      <AlignJustify />
    </Button>
    </>
  );
};

export default EditorOptionsCtrl;
