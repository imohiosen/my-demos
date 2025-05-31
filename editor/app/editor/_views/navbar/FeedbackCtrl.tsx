import { Button } from '@/components/ui/button'
import { LucideLoader } from 'lucide-react'
import React from 'react'

type Props = {}

const FeedbackCtrl = (props: Props) => {
  return (
    <div className='border-l border-secondary pl-2'>
      <Button variant={'outline'}> <LucideLoader/>Feedback</Button>
    </div>
  )
}

export default FeedbackCtrl