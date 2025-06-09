import { useUIConfigStore } from '@/app/editor/_utils/zustand/konva/impl';

import Image from 'next/image';


type Props = {  
  provider: string,
  iconName: string,
};

// Example implementation of camera icon with toSvg-like functionality
export const IconButton = (props: Props) => {
  // Specify options exactly as you would props on the React component:
  const iconSize = useUIConfigStore((state) => state.ADD_CANVAS_ICON_ICON_SIZE);

  // For demonstration - this simula  tes the toSvg functionality
  // Note: React components don't have a direct toSvg method, but we can use the icon directly
  const handleClick = () => {
    // new konva svg
    
  };

  return (
    <button 
      onClick={handleClick}
      className="border-1 border-transparent hover:border-1 hover:border-primary bg-primary/10 rounded-xl flex items-center justify-center size-24"
      aria-label="Camera"
    >
      <Image 
        src="https://unpkg.com/lucide-static@latest/icons/message-square.svg" 
        width={iconSize} 
        height={iconSize} 
        className='p-2'
        alt="Camera Icon"
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
