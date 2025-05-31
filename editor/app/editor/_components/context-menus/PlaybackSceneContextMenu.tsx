"use client";
import React, { useEffect, useState, useRef, useCallback, useLayoutEffect } from "react";
import { Card } from "@/components/ui/card";

// Types
type Props = {};

type Position = { x: number; y: number };

type MenuItem = {
  action: string;
  label: string;
};

const PlaybackSceneContextMenu = ({}: Props) => {
  // State
  const [isVisible, setIsVisible] = useState(false);
  const [anchorPosition, setAnchorPosition] = useState<Position>({ x: 0, y: 0 });
  const [finalMenuPosition, setFinalMenuPosition] = useState<Position>({ x: 0, y: 0 });
  const [isCalculated, setIsCalculated] = useState(false);
  
  // Refs
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Menu configuration
  const menuItems: MenuItem[] = [
    { action: 'play', label: 'Play' },
    { action: 'pause', label: 'Pause' },
    { action: 'restart', label: 'Restart' },
    { action: 'fullscreen', label: 'Fullscreen' },
    { action: 'export', label: 'Export' },
  ];

  // Event handlers
  const handlePlaybackContextMenu = useCallback((e: CustomEvent) => {
    const eventData = e.detail;
    console.log("PlaybackSceneContextMenuEvent triggered", eventData);
    
    const { clientX, clientY } = eventData;
    
    setAnchorPosition({ x: clientX, y: clientY });
    setIsVisible(true);
    setIsCalculated(false);
  }, []);

  const handleNativeContextMenu = useCallback((e: MouseEvent) => {
    if (e.target && (e.target as HTMLElement).classList.contains('playback-scene')) {
      e.preventDefault();
      setAnchorPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
      setIsCalculated(false);
    } else if (e.target instanceof HTMLElement && !e.target.closest('.playback-scene')) {
      setIsVisible(false);
    }
  }, []);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
      setIsVisible(false);
    }
  }, []);

  const handleMenuAction = useCallback((action: string) => {
    console.log(`Playback context menu action: ${action}`);
    setIsVisible(false);
    
    // TODO: Implement actual playback actions
    switch (action) {
      case 'play':
        // Implement play logic
        break;
      case 'pause':
        // Implement pause logic
        break;
      case 'restart':
        // Implement restart logic
        break;
      case 'fullscreen':
        // Implement fullscreen logic
        break;
      case 'export':
        // Implement export logic
        break;
      default:
        console.warn(`Unknown action: ${action}`);
    }
  }, []);

  // Effects
  useEffect(() => {
    const playbackContextMenuHandler = (e: Event) => handlePlaybackContextMenu(e as CustomEvent);
    
    document.addEventListener("X:PlaybackSceneContextMenuEvent", playbackContextMenuHandler);
    document.addEventListener("click", handleClickOutside);
    document.addEventListener('contextmenu', handleNativeContextMenu);

    return () => {
      document.removeEventListener("X:PlaybackSceneContextMenuEvent", playbackContextMenuHandler);
      document.removeEventListener("click", handleClickOutside);
      document.removeEventListener('contextmenu', handleNativeContextMenu);
    };
  }, [handlePlaybackContextMenu, handleClickOutside, handleNativeContextMenu]);

  useLayoutEffect(() => {
    if (isVisible && contextMenuRef.current) {
      const menuEl = contextMenuRef.current;
      const menuWidth = menuEl.offsetWidth;
      const menuHeight = menuEl.offsetHeight;

      setFinalMenuPosition({
        x: anchorPosition.x - menuWidth,
        y: anchorPosition.y - menuHeight
      });
      setIsCalculated(true);
    } else if (!isVisible) {
      setIsCalculated(false);
    }
  }, [isVisible, anchorPosition]);

  // Render
  if (!isVisible) return null;

  return (
    <div 
      ref={contextMenuRef}
      style={{ 
        position: 'fixed', 
        top: finalMenuPosition.y, 
        left: finalMenuPosition.x, 
        zIndex: 1000,
        opacity: isCalculated ? 1 : 0,
        pointerEvents: isCalculated ? 'auto' : 'none',
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

export default PlaybackSceneContextMenu;
