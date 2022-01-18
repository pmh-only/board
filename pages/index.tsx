import useSWR from 'swr'
import type { NextPage } from 'next'
import BoardList from '../components/BoardList'
import Container from '../components/Container'
import PageAnimation from '../components/PageAnimation'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const Home: NextPage = () => {
  const { data } = useSWR('/api/board', fetcher)

  return (
    <PageAnimation>
      <Container>
        <BoardList data={data}/>
      </Container>
    </PageAnimation>
  )
}

export default Home
