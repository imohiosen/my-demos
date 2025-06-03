import Konva from 'konva';
import { GroupConfig } from 'konva/lib/Group'
import { NodeConfig } from 'konva/lib/Node';
import React, { useEffect, useRef } from 'react';
import {Group} from 'react-konva'
type Props = GroupConfig & NodeConfig & {
  children?: React.ReactNode;
}

const XWrapper = (props: Props) => {
  const ref = useRef<Konva.Group>(null);
  useEffect(() => {


  }, [ref])
  return (
    <Group 
    {...props} 
    scale={props.scale || { x: 1, y: 1 }}
    draggable 
    ref={ref} >
      {props.children}
    </Group>
  )
}

export default XWrapper