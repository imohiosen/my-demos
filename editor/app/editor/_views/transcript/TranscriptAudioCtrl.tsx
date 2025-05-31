import { Button } from "@/components/ui/button";
import { LucideMic } from "lucide-react";

type Props = {
  children?: React.ReactNode;
};

const TranscriptAudioCtrl = (props: Props) => {
  return <>
    {props.children}
  </>;
};

export default TranscriptAudioCtrl;
