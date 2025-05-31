import TranscriptAvatarCtrl from "./TranscriptAvatarCtrl";
import TranscriptVoiceCtrl from "./TranscriptVoiceCtrl";
import { Button } from "@/components/ui/button";
import {
  LucideAudioWaveform,
  LucideChevronDown,
  LucideEllipsis,
  LucideMic,
  LucidePauseCircle,
  LucidePlay,
  LucidePlus,
  LucideSquare,
  LucideStars,
} from "lucide-react";
import TranscriptAudioCtrl from "./TranscriptAudioCtrl";
import { Textarea } from "@/components/ui/textarea";
import TranscriptTextInput from "./TranscriptTextInput";

type Props = {};

type Button_1_props = {
  variant?:
    | "ghost"
    | "outline"
    | "default"
    | "link"
    | "destructive"
    | "secondary"
    | null
    | undefined;
  size: "icon" | "sm" | "lg";
  className?: string;
  iconJsx?: React.ReactNode;
  children?: React.ReactNode;
};

const X_Button = (props: Button_1_props) => {
  const { variant, size, className } = props;
  return (
    <Button variant={variant} size={size} className={className}>
      {props.iconJsx!}
      {props.children}
    </Button>
  );
};

const SceneTranscript = (props: Props) => {
  return (
    <>
      <div>
        <div className="flex flex-row gap-2 justify-between">
          <div className="flex flex-row gap-1">
            <TranscriptAvatarCtrl className="text-primary">
              <Button variant="outline" size={"sm"}>
                <LucideSquare size={2} />
                <LucideChevronDown size={2} />
              </Button>
            </TranscriptAvatarCtrl>
            <TranscriptVoiceCtrl className="text-primary">
              <Button variant="outline" size={"sm"}>
                <LucideAudioWaveform size={2} />
                <span className="font-bold">Jim</span>
                <LucideChevronDown size={2} />
              </Button>
            </TranscriptVoiceCtrl>
          </div>
          <div className="flex flex-row gap-1">
            <Button variant={"ghost"} size={"icon"} className="text-primary">
              <LucidePlay className="w-1 h-1" />
            </Button>
            <Button variant={"ghost"} size={"icon"} className="text-primary">
              <LucideEllipsis className="w-1 h-1" />
            </Button>
          </div>
        </div>
        <TranscriptTextInput>
          <Textarea
            placeholder="Type your script here, or upload audio..."
            className="border-0 outline-none focus:ring-0 focus:border-0 focus:outline-none focus-visible:ring-0 focus-visible:outline-none resize-none text-primary"
          />
        </TranscriptTextInput>
        <div className="flex flex-row mt-2">
          <X_Button
            variant={"ghost"}
            size={"sm"}
            className="text-[10px] text-muted-foreground"
            iconJsx={<LucidePlus className="w-1 h-1" />}
          >
            Scene
          </X_Button>

          <TranscriptAudioCtrl>
            <X_Button
              variant={"ghost"}
              size={"sm"}
              className="text-[10px] text-muted-foreground"
              iconJsx={<LucideMic className="w-1 h-1" />}
            >
              Audio
            </X_Button>
          </TranscriptAudioCtrl>

          <X_Button
            variant={"ghost"}
            size={"sm"}
            className="text-[10px] text-muted-foreground"
            iconJsx={<LucidePauseCircle className="w-1 h-1" />}
          >
            Pause
          </X_Button>

          <X_Button
            variant={"ghost"}
            size={"sm"}
            className="text-[10px] text-muted-foreground ml-auto"
            iconJsx={<LucideStars className="w-1 h-1" />}
          >
            Voice Director
          </X_Button>
        </div>
      </div>
    </>
  );
};

export default SceneTranscript;
