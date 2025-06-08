"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useCanvasStore } from "../../_utils/zustand/canvas/canvasStore";
import { CanvasEventData } from "../../_utils/canvas/ho-types";
import { Card } from "@/components/ui/card";
import { usePresenceStore } from "../../_utils/zustand/konva/impl";

type Props = {};

const CanvasContextMenu = ({}: Props) => {
  const updateSelectedItems = usePresenceStore(s => s.updateSelectedItems)
  
  const [objectType, setObjectType] = useState<string>("canvas");
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Extract event handlers for better readability
  const handleCanvasContextMenu = useCallback((e: CustomEvent) => {
    console.log("CanvasContextMenuEvent triggered", e);
    const canvasEventData = e.detail as CanvasEventData | null;

    if (!canvasEventData) {
      console.warn("No target found for context menu event");
      return;
    }

    const { clientX, clientY } = canvasEventData
    
    setPosition({ x: clientX, y: clientY });
    setIsVisible(true);
    
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
      setIsVisible(false);
    }
  }, []);

  const handleRightClickOutside = useCallback((e: MouseEvent) => {
    // Hide context menu if right-click is outside canvas
    if (e.target instanceof HTMLElement && !e.target.closest('canvas')) {
      setIsVisible(false);
    }
  }, []);

  // Menu action handlers
  const handleMenuAction = useCallback((action: string) => {
    console.log(`Context menu action: ${action}`);
    setIsVisible(false);
    
    // TODO: Implement actual actions based on the action type
    switch (action) {
      case 'copy':
        // Implement copy logic
        break;
      case 'paste':
        // Implement paste logic
        break;
      case 'delete':
        // Implement delete logic
        break;
      case 'bringToFront':
        // Implement bring to front logic
        break;
      case 'sendToBack':
        // Implement send to back logic
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  }, []);

  // Setup event listeners
  useEffect(() => {
    const canvasContextMenuHandler = (e: Event) => handleCanvasContextMenu(e as CustomEvent);
    
    document.addEventListener("X:CanvasContextMenuEvent", canvasContextMenuHandler);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener('contextmenu', handleRightClickOutside);

    return () => {
      document.removeEventListener("X:CanvasContextMenuEvent", canvasContextMenuHandler);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener('contextmenu', handleRightClickOutside);
    };
  }, [handleCanvasContextMenu, handleClickOutside, handleRightClickOutside]);

  // Update object type based on selected objects

  const renderContextMenu = () => {
    if (!isVisible) return null;

    const menuItems = getMenuItemsForObjectType(objectType);

    return (
      <div 
        ref={contextMenuRef}
        onContextMenu={(e) => e.preventDefault()} // Prevent default context menu
        style={{ 
          position: 'fixed', 
          top: position.y, 
          left: position.x, 
          zIndex: 1000 
        }}
      >
        <Card className="p-0">
          <div className="py-2 min-w-[150px]">
            {menuItems.map((item) => (
              <div
                key={item.action}
                className="cursor-pointer hover:bg-gray-100 p-2 rounded text-sm px-4"
                onClick={() => handleMenuAction(item.action)}
              >
                {item.label}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  };

  return renderContextMenu();
};

// Helper function to get menu items based on object type
const getMenuItemsForObjectType = (objectType: string) => {
  const baseItems = [
    { action: 'copy', label: 'Copy' },
    { action: 'paste', label: 'Paste' },
  ];

  const objectItems = [
    { action: 'delete', label: 'Delete' },
    { action: 'bringToFront', label: 'Bring to Front' },
    { action: 'sendToBack', label: 'Send to Back' },
  ];

  switch (objectType) {
    case 'object':
      return [...baseItems, ...objectItems];
    case 'canvas':
    default:
      return baseItems;
  }
};

export default CanvasContextMenu;
