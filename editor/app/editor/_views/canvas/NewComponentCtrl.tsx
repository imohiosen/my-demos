import { Button } from "@/components/ui/button";
import { LucideProps } from "lucide-react";
import React, { ForwardRefExoticComponent, RefAttributes } from "react";

type Props = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: "icon" | "default" | "lg" | "sm";
  variant?: "outline" | "default";
  text?: string;
};

const NewComponentCtrl = (props: Props) => {
  return (
    <div>
      <Button
        variant={"secondary"}
        className="size-18 hover:border"
        size={props.size}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        <span className={`flex flex-col items-center gap-2 text-[10px] font-semibold text-primary`}>
          <props.icon /> <span >{props.text}</span>
        </span>
      </Button>
      {/* Add any additional functionality or elements here if needed */}
    </div>
  );
};

export default NewComponentCtrl;
