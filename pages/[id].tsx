import moment from 'moment'
import Head from 'next/head'
import Link from 'next/link'
import { parse } from 'cookie'
import dynamic from 'next/dynamic'
import ReactTooltip from 'react-tooltip'
import { Board } from 'knex/types/tables'
import { useEffect, useRef, useState } from 'react'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { EyeIcon, PencilAltIcon, TrashIcon, XCircleIcon } from '@heroicons/react/outline'

import Comments from '../components/Comments'
import Container from '../components/Container'
import { createDBConnection } from '../utils/db'
import PageAnimation from '../components/PageAnimation'

const Viewer = dynamic(() => import('../components/Viewer'), { ssr: false })

interface Props {
  board: Board
}

const BoardView: NextPage<Props> = ({ board }) => {
  const [scrolls, setScrolls] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const image = useRef(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g.exec(board.content)?.[1])

  useEffect(() => {
    fetch(`/api/view?id=${board.id}`)

    ;(async () => {
      const cookies = parse(document.cookie)

      if (!cookies.token) {
        setIsAdmin(false)
        ReactTooltip.rebuild()
        return
      }

      const res = await fetch('/api/auth/check')
        .then((res) => res.json())

      if (!res.success) {
        setIsAdmin(false)
        ReactTooltip.rebuild()
        return
      }

      setIsAdmin(true)
      ReactTooltip.rebuild()
    })()

    window.addEventListener('scroll', () => {
      setScrolls(window.scrollY > 30)
    })
  }, [])

  return (
    <PageAnimation>
      <Head>
        <title>{board ? board.title : 'board view'} - {process.env.NEXT_PUBLIC_SITE_NAME}</title>
        <meta name="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME}/>
        <meta name="theme-color" content="#CBCBCB"/>
        <meta name="twitter:card" content="summary_large_image"/>

        {board && (
          <>
            <meta property="og:title" content={board.title}/>
            <meta property="og:description" content={board.content.substring(0, 100)}/>
            <meta property="og:image" content={image.current || `https://picsum.photos/200?blur#${board.id}`}/>
          </>
        )}
      </Head>

      <Container className="max-w-4xl">
        <div className="flex flex-col min-h-full gap-6 py-5">
          <div className="bg-white rounded-lg shadow grow">
            {!board &&
              <div className="flex items-center justify-center h-full gap-1 text-sm text-neutral-500">
                <XCircleIcon className="w-5 h-5"/> 없는 페이지입니다.
              </div>}

            {board && (
              <div>
                <div className={`sticky z-40 transition-all flex items-center ${scrolls ? 'fixed top-0 bg-transparent justify-center py-1 px-32' : 'rounded-t-lg justify-between border-b py-2 bg-neutral-100 px-5'}`}>
                  <div className="flex items-end w-full gap-3">
                    <h1 className="flex-1 max-w-full overflow-hidden text-xl font-bold break-all text-ellipsis text-neutral-600 whitespace-nowrap">{board.title}</h1>
                    <p className="hidden py-1 text-xs sm:block text-neutral-500">{moment(board.created_at).format('YYYY년 MM월 DD일')}</p>
                    <p className="flex items-end gap-1 py-1 text-xs text-neutral-500"><EyeIcon className="w-3 h-3"/> {board.views}</p>
                  </div>
                  {!scrolls && (
                    <div className="flex gap-1 text-neutral-500">
                      {isAdmin &&
                        <Link passHref href={`/edit?id=${board.id}`}>
                          <div data-tip="수정" className="p-1 transition-all rounded-lg cursor-pointer hover:bg-neutral-200">
                            <PencilAltIcon className="w-5 h-5"/>
                          </div>
                        </Link>}

                      {isAdmin &&
                        <Link passHref href={`/delete?id=${board.id}`}>
                          <div data-tip="삭제" className="p-1 transition-all rounded-lg cursor-pointer hover:bg-neutral-200">
                            <TrashIcon className="w-5 h-5"/>
                          </div>
                        </Link>}
                    </div>
                  )}
                </div>

                <div className="px-5 py-2">
                  <Viewer content={board.content}/>
                </div>
              </div>
            )}
          </div>

          {board && <Comments id={board.id} isAdmin={isAdmin} />}
        </div>
      </Container>
    </PageAnimation>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  const id = context.params?.id as string
  const db = createDBConnection()

  const [board] = await db.select('*').from('board').where('id', id)

  return {
    props: { board: JSON.parse(JSON.stringify(board)) },
    revalidate: 10 // In seconds
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const db = createDBConnection()
  const boards = await db.select('id').from('board')

  const paths = boards.map((board) => ({
    params: { id: board.id.toString() }
  }))

  return { paths, fallback: 'blocking' }
}

export default BoardView
