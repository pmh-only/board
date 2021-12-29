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
        <div className="flex flex-wrap justify-center gap-8 mt-5 items-center">
          {data && data.boards.map((v: Board & { image?: string }) => (
            <Link key={v.id} href={`/${v.id}`} passHref>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white hover:bg-neutral-50 rounded shadow max-w-xs w-full hover:outline outline-3 outline-blue-200 hover:shadow-md transition-all cursor-pointer">
                <Image url={v.image || `https://picsum.photos/200?blur#${v.id}`} alt={v.title} />
                <div className="px-5 py-3 flex flex-col gap-1">
                  <h1 className="font-bold text-xl">{v.title}</h1>
                  <p className="text-sm text-neutral-500 text-ellipsis break-all whitespace-nowrap overflow-hidden">{v.content.replace(/<[^>]*>?/gm, '') || '본문이 없습니다'}</p>
                  <p className="text-xs text-neutral-500 flex items-center gap-1">
                    <ClockIcon className="w-4 h-4 inline"/>
                    <p>{moment(v.created_at).format('YYYY년 MM월 DD일')}</p>
                    <EyeIcon className="w-4 h-4 inline" />
                    <p>{v.views}</p>
                  </p>
                  <p className="flex gap-1 text-sm text-neutral-700">{v.tags.split(',').filter((tag) => tag).map((tag, i) => <span key={i} className="px-2 rounded-full bg-blue-200">#{tag}</span>)}</p>
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
