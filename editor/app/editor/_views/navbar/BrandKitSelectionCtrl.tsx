import { Button } from '@/components/ui/button'
import { LucideLoader } from 'lucide-react'
import React from 'react'

type Props = {}

const BrandKitSelectionCtrl = (props: Props) => {
  return (
    <Button variant={'outline'}> <LucideLoader/> My Brand Campaign Kit</Button>
  )
}

export default BrandKitSelectionCtrl