import { GroupConfig } from 'konva/lib/Group'
import React, { use, useEffect, useRef } from 'react'
import {Group} from 'react-konva'
type Props = GroupConfig 

const XGroup = (props: Props) => {
  const ref = useRef(null)
  useEffect(() => {
    // This effect runs once when the component mounts
    // You can add any initialization logic here if needed
    if (ref.current) {
      // Example: Log the ref to see if it's correctly assigned
    }

  }, [ref])
  return (
    <Group {...props} draggable ref={ref} />
  )
}

export default XGroup