import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import React from 'react'

type Props = {
    children?: React.ReactNode
    className?: string
}
const AddBg = (props: Props) => {
  return (
    <div className={props.className}>
    <Popover>
      <PopoverTrigger asChild>
        {props.children}
      </PopoverTrigger>
      <PopoverContent className="w-80 h-80">

      </PopoverContent>
    </Popover>

    </div>
  )
}

export default AddBg