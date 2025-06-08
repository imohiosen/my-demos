import { Card } from '@/components/ui/card'
import React from 'react'
import PlaybackScenes from './PlaybackScenes'
import PlaybackSceneContextMenu from '../../_components/context-menus/PlaybackSceneContextMenu'

type Props = {}

const Playback = (props: Props) => {
  return (
    <Card className='h-full p-4 py-0 overflow-hidden'>
      <PlaybackScenes />
      <PlaybackSceneContextMenu />
    </Card>
  )
}

export default Playback