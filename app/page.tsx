import { CoverSpread } from '@/components/cover-spread'
import { IssueLeaf } from '@/components/issue-leaf'

export const metadata = {
  title: 'CityAge',
}

export default function Home() {
  return (
    <IssueLeaf href="/" cover>
      <CoverSpread />
    </IssueLeaf>
  )
}
