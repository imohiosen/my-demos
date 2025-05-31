import { Button } from '@/components/ui/button'
import { LucideEye, LucidePlay } from 'lucide-react'
import React from 'react'

type Props = {}

const PreviewCtrl = (props: Props) => {
    return <Button variant={'outline'} >
      <LucidePlay/>
      Preview</Button>
}

export default PreviewCtrl