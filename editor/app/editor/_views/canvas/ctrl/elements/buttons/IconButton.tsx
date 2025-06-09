import { Camera } from 'lucide-react';

// Example implementation of camera icon with toSvg-like functionality
export const IconButton = () => {
  // Specify options exactly as you would props on the React component:
  const options = {
    width: 256,
    height: 256,
    color: 'currentColor',
    strokeWidth: 2
  };

  // For demonstration - this simulates the toSvg functionality
  // Note: React components don't have a direct toSvg method, but we can use the icon directly
  const handleClick = () => {
    // This demonstrates how you might extract SVG if needed
    // In practice, you'd use the Camera component directly in JSX
    console.log('Camera icon clicked with options:', options);
    
    // If you need the actual SVG string, you'd typically use a different approach
    // such as server-side rendering or a separate utility function
  };

  return (
    <button 
      onClick={handleClick}
      className="p-2 hover:bg-gray-100 rounded-md transition-colors"
      aria-label="Camera"
    >
      <Camera 
        width={options.width}
        height={options.height}
        color={options.color}
        strokeWidth={options.strokeWidth}
      />
    </button>
  );
};

// Alternative approach if you specifically need SVG string generation
export const generateCameraSvg = () => {
  const options = {
    width: 24,
    height: 24,
    color: 'currentColor',
    strokeWidth: 2
  };

  // This would be the equivalent of camera.toSvg(options)
  // Note: lucide-react doesn't have a direct toSvg method
  // You might need to use the base lucide package or implement custom SVG generation
  const svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width}" height="${options.height}" viewBox="0 0 24 24" fill="none" stroke="${options.color}" stroke-width="${options.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"><path d="m9 9-.5-1a2 2 0 0 0-1.9-1.4H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1.6a2 2 0 0 0-1.9 1.4L15 9"/><circle cx="12" cy="13" r="3"/></svg>`;
  
  console.log(svgString);
  return svgString;
};

export default IconButton;
