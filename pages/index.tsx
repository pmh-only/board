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

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const Home: NextPage = () => {
  const { data } = useSWR('/api/board', fetcher)

  return (
    <PageAnimation>
      <Container>
        <div className="flex flex-wrap items-center justify-center gap-8 mt-5">
          {data && data.boards.map((v: Board & { image?: string }) => (
            <Link key={v.id} href={`/${v.id}`} passHref>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full max-w-xs transition-all bg-white rounded shadow cursor-pointer hover:bg-neutral-50 hover:outline outline-3 outline-blue-200 hover:shadow-md">
                <Image url={v.image || `https://picsum.photos/200?blur#${v.id}`} alt={v.title} />
                <div className="flex flex-col gap-1 px-5 py-3">
                  <h1 className="text-xl font-bold">{v.title}</h1>
                  <p className="overflow-hidden text-sm break-all text-neutral-500 text-ellipsis whitespace-nowrap">{v.content.replace(/<[^>]*>?/gm, '') || '본문이 없습니다'}</p>
                  <p className="flex items-center gap-1 text-xs text-neutral-500">
                    <ClockIcon className="inline w-4 h-4"/>
                    <p>{moment(v.created_at).format('YYYY년 MM월 DD일')}</p>
                    <EyeIcon className="inline w-4 h-4" />
                    <p>{v.views}</p>
                  </p>
                  <p className="flex flex-wrap gap-1 text-sm text-neutral-700">
                    {v.tags.split(',')
                      .filter((tag) => tag)
                      .map((tag, i) =>
                        <span key={i} className="px-2 bg-blue-200 rounded-full">#{tag}</span>
                      )}
                  </p>
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
