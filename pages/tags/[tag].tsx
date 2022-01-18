import useSWR from 'swr'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { fetchJSON } from '../../utils/io'
import BoardList from '../../components/BoardList'
import Container from '../../components/Container'
import PageAnimation from '../../components/PageAnimation'

const TagPage: NextPage = () => {
  const router = useRouter()
  const { data } = useSWR(`/api/board?has=${router.query.tag}`, fetchJSON)

  return (
    <PageAnimation>
      <Container>
        <BoardList data={data}/>
      </Container>
    </PageAnimation>
  )
}

export default TagPage
