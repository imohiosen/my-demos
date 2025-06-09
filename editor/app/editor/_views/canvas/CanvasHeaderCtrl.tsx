import NewComponentCtrl from "./NewComponentCtrl";
import {
  LucideCircleUser,
  LucideCreativeCommons,
  LucideImage,
  LucideShapes,
  LucideStickyNote,
  LucideType,
} from "lucide-react";
import AddAvatar from "./ctrl/AddAvatar";
import AddBg from "./ctrl/AddBg";
import AddText from "./ctrl/AddText";
import AddMedia from "./ctrl/AddMedia";
import AddElementView from "./ctrl/AddElementView";
import AddCaption from "./ctrl/AddCaption";

type Props = {};

const CanvasHeaderCtrl = (props: Props) => {
  return (
    <div className="flex items-center gap-0.5">
      <AddAvatar >
        <NewComponentCtrl size={'lg'} icon={LucideCircleUser} text={'Avatar'} />
      </AddAvatar>
      <AddText>
        <NewComponentCtrl size={'lg'} icon={LucideType} text={'Text'} />
      </AddText>
      <AddMedia>
        <NewComponentCtrl size={'lg'} icon={LucideImage} text={'Media'} />
      </AddMedia>
      <AddElementView >
        <NewComponentCtrl size={'lg'} icon={LucideShapes} text={'Element'} />
      </AddElementView>
      <AddCaption>
        <NewComponentCtrl size={'lg'} icon={LucideCreativeCommons} text={'Caption'} />
      </AddCaption>  
      <AddBg>
        <NewComponentCtrl size={'lg'} icon={LucideStickyNote} text={'Background'}/>
      </AddBg>
    </div>
  );
};

export default CanvasHeaderCtrl;
