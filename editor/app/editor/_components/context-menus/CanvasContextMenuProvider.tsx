import React, { createContext, useContext, useState, useRef } from "react";
import CanvasTextContextMenu from "./CanvasTextContextMenu";

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  object: any;
}

interface CanvasContextMenuContextType {
  showContextMenu: (x: number, y: number, object: any) => void;
  hideContextMenu: () => void;
}

const CanvasContextMenuContext = createContext<CanvasContextMenuContextType | null>(null);

export const useCanvasContextMenu = () => {
  const context = useContext(CanvasContextMenuContext);
  if (!context) {
    throw new Error("useCanvasContextMenu must be used within CanvasContextMenuProvider");
  }
  return context;
};

interface Props {
  children: React.ReactNode;
}

export const CanvasContextMenuProvider = ({ children }: Props) => {
  const [menuState, setMenuState] = useState<ContextMenuState>({
    isOpen: false,
    x: 0,
    y: 0,
    object: null,
  });
  const triggerRef = useRef<HTMLDivElement>(null);

  const showContextMenu = (x: number, y: number, object: any) => {
    setMenuState({ isOpen: true, x, y, object });
    
    // Create a temporary trigger element at the cursor position
    const trigger = document.createElement('div');
    trigger.style.position = 'fixed';
    trigger.style.left = `${x}px`;
    trigger.style.top = `${y}px`;
    trigger.style.width = '1px';
    trigger.style.height = '1px';
    trigger.style.pointerEvents = 'none';
    trigger.style.zIndex = '9999';
    document.body.appendChild(trigger);
    
    // Simulate right click on the trigger
    const event = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      clientX: x,
      clientY: y,
    });
    trigger.dispatchEvent(event);
    
    // Clean up trigger after a short delay
    setTimeout(() => {
      document.body.removeChild(trigger);
    }, 100);
  };

  const hideContextMenu = () => {
    setMenuState(prev => ({ ...prev, isOpen: false }));
  };

  const handleTextActions = {
    onCopy: () => console.log('Copy text object'),
    onPaste: () => console.log('Paste'),
    onDelete: () => {
      if (menuState.object?.canvas) {
        menuState.object.canvas.remove(menuState.object);
      }
      hideContextMenu();
    },
    onDuplicate: () => console.log('Duplicate text object'),
    onBold: () => console.log('Toggle bold'),
    onItalic: () => console.log('Toggle italic'),
    onUnderline: () => console.log('Toggle underline'),
  };

  return (
    <CanvasContextMenuContext.Provider value={{ showContextMenu, hideContextMenu }}>
      {children}
      {menuState.isOpen && menuState.object?.type === 'text' && (
        <div
          style={{
            position: 'fixed',
            left: menuState.x,
            top: menuState.y,
            zIndex: 1000,
          }}
        >
          <CanvasTextContextMenu {...handleTextActions}>
            <div ref={triggerRef} />
          </CanvasTextContextMenu>
        </div>
      )}
    </CanvasContextMenuContext.Provider>
  );
};
