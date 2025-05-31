import { Button } from '@/components/ui/button'
import { LucideCircleHelp } from 'lucide-react'

type Props = {}

const HelpCtrl = (props: Props) => {
  return (
    <Button variant={'outline'} size={'icon'}><LucideCircleHelp/></Button>
  )
}

export default HelpCtrl