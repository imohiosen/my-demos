import React from 'react'

type Props = {
  children?: React.ReactNode;
}

const TranscriptTextInput = (props: Props) => {
  return (
    <>{props.children}</>
  )
}

export default TranscriptTextInput