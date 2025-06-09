import { useUIConfigStore } from '@/app/editor/_utils/zustand/konva/impl';
import { DComponent } from '@/app/editor/_utils/zustand/konva/types';
import Konva from 'konva';
import Image from 'next/image';

type Props = {  
  provider: string,
  iconName: string,
  insertFn: (element: DComponent) => void;
  postClick: () => void;
  selectedSceneId: string;
};

// Create a predefined SVG path component based on iconName
const createPredefinedIcon = (iconName: string) => {
  // For now, create a simple rectangle as placeholder for SVG
  // In a real implementation, you'd have actual SVG path data
  return new Konva.Rect({
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    fill: "black",
    stroke: "black",
    strokeWidth: 2,
    type: "rect",
  });
};

// Example implementation of icon button with canvas insertion functionality
export const IconButton = (props: Props) => {
  const config = useUIConfigStore((state) => state);

  const handleClick = () => {
    // Create a new konva element based on the icon
    const predefinedComponent = createPredefinedIcon(props.iconName);
    const id = `element-icon-${props.iconName}-${Date.now()}`;
    
    props.insertFn({
      componentId: id,
      sceneId: props.selectedSceneId,
      type: "element",
      element: {
        attribute: { ...predefinedComponent.attrs },
      },
    });
    props.postClick();
  };

  return (
    <button 
      onClick={handleClick}
      className={`border-1 border-transparent hover:border-1 hover:border-primary bg-primary/10 rounded-xl flex items-center justify-center size-24`}
      aria-label={props.iconName}
    >
      <Image 
        src={`https://unpkg.com/lucide-static@latest/icons/${props.iconName}.svg`}
        width={config.ADD_CANVAS_COMPONENT_BUTTON_SIZE} 
        height={config.ADD_CANVAS_COMPONENT_BUTTON_SIZE} 
        className='p-2'
        alt={`${props.iconName} Icon`}
      />
    </button>
  );
};

// Alternative approach if you specifically need SVG string generation
export const generateCameraSvg = ({
  width,
  height,
  color,
  strokeWidth,
  iconName ,
}: {
  width: number;
  height: number;
  color: string;
  strokeWidth: number;
  iconName: string;
}) => {
  switch (iconName) {
    case 'camera':
      return <Image 
        src="https://unpkg.com/lucide-static@latest/icons/house.svg" 
        width={width} 
        height={height} 
        style={{ fill: color, strokeWidth: strokeWidth }} 
        alt="Camera Icon" 
      />;
    case 'house':
      return ;
    default:
      console.error(`Icon "${iconName}" not found.`);
      return null; // Handle other icons or return a default SVG
  }
};

export default IconButton;
