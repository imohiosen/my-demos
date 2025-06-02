import { GroupConfig } from 'konva/lib/Group'
import React from 'react'
import {Group} from 'react-konva'
type Props = GroupConfig 

const XGroup = (props: Props) => {
  return (
    <div><Group {...props} /></div>
  )
}

export default XGroup