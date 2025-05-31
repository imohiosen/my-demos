import React from 'react'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

type Props = {
  children: React.ReactNode
  onChangeColor?: (color: string) => void
  onChangeGradient?: (gradient: string) => void
  onUploadImage?: () => void
  onRemoveBackground?: () => void
  onPaste?: () => void
}

const CanvasBgContextMenu = ({ 
  children,
  onChangeColor,
  onChangeGradient,
  onUploadImage,
  onRemoveBackground,
  onPaste
}: Props) => {
  return (
    <ContextMenu>
      <ContextMenuTrigger>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem>
          Change Background
        </ContextMenuItem>
        <ContextMenuItem>
          Remove Background
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem>
          Background Settings
        </ContextMenuItem>
        {onChangeColor && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>Background Color</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-32">
              <ContextMenuItem onClick={() => onChangeColor('#ffffff')}>
                White
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onChangeColor('#000000')}>
                Black
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onChangeColor('#3b82f6')}>
                Blue
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onChangeColor('#ef4444')}>
                Red
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onChangeColor('#22c55e')}>
                Green
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {onChangeGradient && (
          <ContextMenuSub>
            <ContextMenuSubTrigger>Gradient</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-40">
              <ContextMenuItem onClick={() => onChangeGradient('linear-gradient(45deg, #3b82f6, #8b5cf6)')}>
                Blue Purple
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onChangeGradient('linear-gradient(45deg, #f59e0b, #ef4444)')}>
                Orange Red
              </ContextMenuItem>
              <ContextMenuItem onClick={() => onChangeGradient('linear-gradient(45deg, #10b981, #3b82f6)')}>
                Green Blue
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
        )}

        {onUploadImage && (
          <ContextMenuItem onClick={onUploadImage}>
            Upload Background Image
          </ContextMenuItem>
        )}

        {onRemoveBackground && (
          <ContextMenuItem onClick={onRemoveBackground}>
            Remove Background
          </ContextMenuItem>
        )}

        <ContextMenuSeparator />

        {onPaste && (
          <ContextMenuItem onClick={onPaste}>
            Paste
          </ContextMenuItem>
        )}
      </ContextMenuContent>
    </ContextMenu>
  )
}

export default CanvasBgContextMenu
