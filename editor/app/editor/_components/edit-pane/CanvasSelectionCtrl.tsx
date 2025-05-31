"use client";
import React, { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import { 
  Move, 
  Copy, 
  Trash2, 
  RotateCw, 
  Flag as Flip, 
  Layers, 
  Palette, 
  Settings,
  ChevronDown 
} from 'lucide-react'

type Props = {
  className?: string
}

const CanvasSelectionCtrl = (props: Props) => {
  const [hasSelection, setHasSelection] = useState(false)

  useEffect(() => {
    const handleSelectionEvent = (e: Event) => {
      const customEvent = e as CustomEvent
      const { type, selected } = customEvent.detail
      console.log('CanvasSelectionCtrl event:', type, selected);
      // Show toolbar when objects are selected, hide when cleared
      setHasSelection(type !== 'selectionCleared' && selected.length > 0)

    }

    document.addEventListener('X:CanvasSelectionEvent', handleSelectionEvent)
    
    return () => {
      document.removeEventListener('X:CanvasSelectionEvent', handleSelectionEvent)
    }
  }, [])

  // Don't render if no selection
  if (!hasSelection) {
    return null
  }

  return (
    <div className={`${props.className}`}>
      <div className='flex items-center justify-center h-full w-full'>
        <div className='flex items-center gap-1 p-2 bg-background border rounded-lg shadow-sm'>
          
          {/* Move/Position Tools */}
          <Button variant="ghost" size="sm">
            <Move className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Copy className="h-4 w-4" />
          </Button>
          
          <Button variant="ghost" size="sm">
            <Trash2 className="h-4 w-4" />
          </Button>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Transform Tools */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <RotateCw className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm" className="justify-start">
                  Rotate 90° CW
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Rotate 90° CCW
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Rotate 180°
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Flip className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm" className="justify-start">
                  Flip Horizontal
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Flip Vertical
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Layer Tools */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Layers className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm" className="justify-start">
                  Bring to Front
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Bring Forward
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Send Backward
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Send to Back
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
          {/* Style Tools */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Palette className="h-4 w-4" />
                <ChevronDown className="h-3 w-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56">
              <div className="flex flex-col gap-2">
                <div>
                  <label className="text-sm font-medium">Fill Color</label>
                  <div className="flex gap-2 mt-1">
                    <div className="w-6 h-6 bg-red-500 rounded border cursor-pointer" />
                    <div className="w-6 h-6 bg-blue-500 rounded border cursor-pointer" />
                    <div className="w-6 h-6 bg-green-500 rounded border cursor-pointer" />
                    <div className="w-6 h-6 bg-yellow-500 rounded border cursor-pointer" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Stroke Color</label>
                  <div className="flex gap-2 mt-1">
                    <div className="w-6 h-6 border-2 border-black rounded cursor-pointer" />
                    <div className="w-6 h-6 border-2 border-gray-500 rounded cursor-pointer" />
                    <div className="w-6 h-6 border-2 border-blue-500 rounded cursor-pointer" />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Separator orientation="vertical" className="h-6" />
          
          {/* Settings */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="flex flex-col gap-1">
                <Button variant="ghost" size="sm" className="justify-start">
                  Lock Selection
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Group Objects
                </Button>
                <Button variant="ghost" size="sm" className="justify-start">
                  Ungroup Objects
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          
        </div>
      </div>
    </div>
  )
}

export default CanvasSelectionCtrl