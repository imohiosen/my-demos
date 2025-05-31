import { Button } from '@/components/ui/button'
import { LucideCheck } from 'lucide-react'
import React from 'react'

type Props = {}

const GenerateCtrl = (props: Props) => {
    return <Button variant={'default'} >
      <LucideCheck/>
      Generate</Button>
}

export default GenerateCtrl