import { Button } from '@/components/ui/button'
import { LucideHistory } from 'lucide-react'
import React from 'react'

type Props = {}

const HistoryCtrl = (props: Props) => {
    return <Button variant={'outline'} size={'icon'}><LucideHistory/></Button>
}

export default HistoryCtrl