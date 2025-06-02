import { TextConfig } from 'konva/lib/shapes/Text'
import React from 'react'
import {Text} from 'react-konva'
type Props = TextConfig

const XText = (props: Props) => {
  return (
    <div><Text {...props} /></div>
  )
}

export default XText