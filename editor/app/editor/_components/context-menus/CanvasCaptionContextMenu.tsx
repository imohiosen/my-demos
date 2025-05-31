import React from "react";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

type Props = {
  children: React.ReactNode;
  onChangePosition?: (position: 'top' | 'bottom' | 'left' | 'right') => void
  onChangeAlignment?: (alignment: 'left' | 'center' | 'right') => void
  onChangeFontSize?: (size: number) => void
  onToggleBold?: () => void
  onToggleItalic?: () => void
  onCopy?: () => void
  onPaste?: () => void
  onDelete?: () => void
  onDuplicate?: () => void
};

const CanvasCaptionContextMenu = ({
  children,
  onChangePosition,
  onChangeAlignment,
  onChangeFontSize,
  onToggleBold,
  onToggleItalic,
  onCopy,
  onPaste,
  onDelete,
  onDuplicate
}: Props) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        {onChangePosition && (
          <ContextMenuItem>
            Position
          </ContextMenuItem>
        )}

        {onChangeAlignment && (
          <ContextMenuItem>
            Alignment
          </ContextMenuItem>
        )}

        {onChangeFontSize && (
          <ContextMenuItem>
            Font Size
          </ContextMenuItem>
        )}

        {onToggleBold && (
          <ContextMenuItem onClick={onToggleBold}>
            Bold
            <ContextMenuShortcut>⌘B</ContextMenuShortcut>
          </ContextMenuItem>
        )}
        {onToggleItalic && (
          <ContextMenuItem onClick={onToggleItalic}>
            Italic
            <ContextMenuShortcut>⌘I</ContextMenuShortcut>
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        {onCopy && (
          <ContextMenuItem onClick={onCopy} disabled={!onCopy}>
            Copy
            <ContextMenuShortcut>⌘C</ContextMenuShortcut>
          </ContextMenuItem>
        )}
        {onPaste && (
          <ContextMenuItem onClick={onPaste}>
            Paste
            <ContextMenuShortcut>⌘V</ContextMenuShortcut>
          </ContextMenuItem>
        )}
        {onDelete && (
          <ContextMenuItem
            onClick={onDelete}
            className="text-destructive"
            disabled={!onDelete}
          >
            Delete
            <ContextMenuShortcut>⌫</ContextMenuShortcut>
          </ContextMenuItem>
        )}
        {onDuplicate && (
          <ContextMenuItem onClick={onDuplicate} disabled={!onDuplicate}>
            Duplicate
            <ContextMenuShortcut>⌘D</ContextMenuShortcut>
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default CanvasCaptionContextMenu;
