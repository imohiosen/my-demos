import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type Props = {
  children: React.ReactNode;
  onCopy?: () => void;
  onPaste?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onBringToFront?: () => void;
  onSendToBack?: () => void;
  onBringForward?: () => void;
  onSendBackward?: () => void;
  onGroup?: () => void;
  onUngroup?: () => void;
  onLock?: () => void;
  onUnlock?: () => void;
};

const CanvasElementContextMenu = ({
  children,
  onCopy,
  onPaste,
  onDelete,
  onDuplicate,
  onBringToFront,
  onSendToBack,
  onBringForward,
  onSendBackward,
  onGroup,
  onUngroup,
  onLock,
  onUnlock,
}: Props) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {(onBringToFront || onSendToBack || onBringForward || onSendBackward) && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>Arrange</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-48">
              {onBringToFront && (
                <ContextMenuItem onClick={onBringToFront}>
                  Bring to Front
                </ContextMenuItem>
              )}
              {onBringForward && (
                <ContextMenuItem onClick={onBringForward}>
                  Bring Forward
                </ContextMenuItem>
              )}
              {onSendBackward && (
                <ContextMenuItem onClick={onSendBackward}>
                  Send Backward
                </ContextMenuItem>
              )}
              {onSendToBack && (
                <ContextMenuItem onClick={onSendToBack}>
                  Send to Back
                </ContextMenuItem>
              )}
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {onGroup && (
          <ContextMenuItem onClick={onGroup}>
            Group
            <ContextMenuShortcut>⌘G</ContextMenuShortcut>
          </ContextMenuItem>
        )}
        {onUngroup && (
          <ContextMenuItem onClick={onUngroup}>
            Ungroup
            <ContextMenuShortcut>⌘⇧G</ContextMenuShortcut>
          </ContextMenuItem>
        )}

        {onLock && (
          <ContextMenuItem onClick={onLock}>
            Lock
          </ContextMenuItem>
        )}
        {onUnlock && (
          <ContextMenuItem onClick={onUnlock}>
            Unlock
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        <ContextMenuItem onClick={onCopy} disabled={!onCopy}>
          Copy
          <ContextMenuShortcut>⌘C</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onPaste} disabled={!onPaste}>
          Paste
          <ContextMenuShortcut>⌘V</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem onClick={onDuplicate} disabled={!onDuplicate}>
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={onDelete}
          className="text-destructive"
          disabled={!onDelete}
        >
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CanvasElementContextMenu;
