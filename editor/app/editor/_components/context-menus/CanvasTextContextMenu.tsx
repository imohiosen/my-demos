import React, { useEffect } from "react";
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
  onBold?: () => void;
  onItalic?: () => void;
  onUnderline?: () => void;
  onChangeFont?: (font: string) => void;
  onChangeFontSize?: (size: number) => void;
};

const CanvasTextContextMenu = ({
  children,
  onCopy,
  onPaste,
  onDelete,
  onDuplicate,
  onBold,
  onItalic,
  onUnderline,
  onChangeFont,
  onChangeFontSize,
}: Props) => {


  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          Edit Text
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Text Style</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {onBold && (
              <ContextMenuItem onClick={onBold}>
                Bold
              </ContextMenuItem>
            )}
            {onItalic && (
              <ContextMenuItem onClick={onItalic}>
                Italic
              </ContextMenuItem>
            )}
            {onUnderline && (
              <ContextMenuItem onClick={onUnderline}>
                Underline
              </ContextMenuItem>
            )}
            <ContextMenuSeparator />
            {onChangeFont && (
              <ContextMenuItem onClick={() => onChangeFont('Arial')}>
                Font Family
              </ContextMenuItem>
            )}
            {onChangeFontSize && (
              <ContextMenuItem onClick={() => onChangeFontSize(12)}>
                Font Size
              </ContextMenuItem>
            )}
          </ContextMenuSubContent>
        </ContextMenuSub>
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

export default CanvasTextContextMenu;
