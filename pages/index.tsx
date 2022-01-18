import useSWR from 'swr'
import type { NextPage } from 'next'
import { Board } from 'knex/types/tables'
import Container from '../components/Container'
import PageAnimation from '../components/PageAnimation'
import moment from 'moment'
import { ClockIcon, EyeIcon } from '@heroicons/react/outline'
import Link from 'next/link'
import Image from '../components/Image'
import { motion } from 'framer-motion'
import ScrollContainer from 'react-indiana-drag-scroll'

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const Home: NextPage = () => {
  const { data } = useSWR('/api/board', fetcher)

  return (
    <PageAnimation>
      <Container>
        <div className="flex flex-wrap justify-center gap-6 my-5 lg:gap-8">
          {data && data.boards.map((v: Board & { image?: string }) => (
            <Link key={v.id} href={`/${v.id}`} passHref>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full transition-all bg-white rounded-lg shadow cursor-pointer md:max-w-xs hover:bg-neutral-50 hover:outline outline-3 outline-blue-200 hover:shadow-md">
                <Image url={v.image || `https://picsum.photos/200?blur#${v.id}`} alt={v.title} />
                <div className="flex flex-col gap-1 px-5 py-3">
                  <h1 className="text-xl font-bold">{v.title}</h1>
                  <p className="overflow-hidden text-sm break-all text-neutral-500 text-ellipsis whitespace-nowrap">{v.content.replace(/<[^>]*>?/gm, '') || '본문이 없습니다'}</p>
                  <p className="flex items-center gap-3 text-xs text-neutral-500">
                    <p data-tip="작성일"><ClockIcon className="inline w-4 h-4"/> {moment(v.created_at).format('YYYY년 MM월 DD일')}</p>
                    <p data-tip="조회수"><EyeIcon className="inline w-4 h-4" /> {v.views}</p>
                  </p>
                  <ScrollContainer className="mt-1 overflow-x-hidden text-sm select-none text-neutral-700" style={{ wordBreak: 'keep-all' }}>
                    {v.tags.split(',')
                      .filter((tag) => tag)
                      .map((tag, i) =>
                        <Link key={i} href={`/tags/${tag.trim()}`} passHref>
                          <span
                            data-tip="클릭하면 해당 테그가 있는 게시글만 표시합니다."
                            className="px-2 mr-1 transition-colors bg-blue-200 rounded-full hover:bg-blue-300">
                            #{tag.trim()}
                          </span>
                        </Link>
                      )}
                  </ScrollContainer>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </Container>
    </PageAnimation>
  )
}

export default Home
