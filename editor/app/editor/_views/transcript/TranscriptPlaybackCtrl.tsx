import React from 'react'

type Props = {
  children?: React.ReactNode;
}

const TranscriptPlaybackCtrl = (props: Props) => {
  return (
    <div>
      {props.children}
    </div>
  )
}

export default TranscriptPlaybackCtrl