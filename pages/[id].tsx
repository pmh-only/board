import moment from 'moment'
import Head from 'next/head'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { EyeIcon, PencilAltIcon, TrashIcon, XCircleIcon } from '@heroicons/react/outline'

import 'prismjs/themes/prism-tomorrow.css'
import '@toast-ui/chart/dist/toastui-chart.css'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'

import Container from '../components/Container'
import PageAnimation from '../components/PageAnimation'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { parse } from 'cookie'
import ReactTooltip from 'react-tooltip'
import { createDBConnection } from '../utils/db'
import { Board } from 'knex/types/tables'

const Viewer = dynamic(() => import('../components/Viewer'), { ssr: false })

interface Props {
  board: Board
}

const BoardView: NextPage<Props> = ({ board }) => {
  const [editBtnVisiable, setEditBtnVisiable] = useState(false)
  const image = useRef(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g.exec(board.content)?.[1])

  useEffect(() => {
    fetch(`/api/board/view?id=${board.id}`)

    ;(async () => {
      const cookies = parse(document.cookie)

      if (!cookies.token) {
        setEditBtnVisiable(false)
        ReactTooltip.rebuild()
        return
      }

      const res = await fetch('/api/auth/check')
        .then((res) => res.json())

      if (!res.success) {
        setEditBtnVisiable(false)
        ReactTooltip.rebuild()
        return
      }

      setEditBtnVisiable(true)
      ReactTooltip.rebuild()
    })()
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
        <div className="flex min-h-full py-5">
          <div className="bg-white rounded shadow grow">
            {!board &&
              <div className="flex items-center justify-center h-full gap-1 text-sm text-neutral-500">
                <XCircleIcon className="w-5 h-5"/> 없는 페이지입니다.
              </div>}

            {board && (
              <div>
                <div className="sticky flex items-center justify-between px-5 py-2 border-b top-10 bg-neutral-100">
                  <div className="flex items-end gap-3">
                    <h1 className="text-xl font-bold">{board.title}</h1>
                    <p className="py-1 text-xs text-neutral-500">{moment(board.created_at).format('YYYY년 MM월 DD일')}</p>
                    <p className="flex items-end gap-1 py-1 text-xs text-neutral-500"><EyeIcon className="w-3 h-3"/> {board.views}</p>
                  </div>
                  <div className="flex gap-1 text-neutral-500">
                    {editBtnVisiable &&
                      <Link passHref href={`/edit?id=${board.id}`}>
                        <div data-tip="수정" className="p-1 transition-all rounded cursor-pointer hover:bg-neutral-200">
                          <PencilAltIcon className="w-5 h-5"/>
                        </div>
                      </Link>}

                    {editBtnVisiable &&
                      <Link passHref href={`/delete?id=${board.id}`}>
                        <div data-tip="삭제" className="p-1 transition-all rounded cursor-pointer hover:bg-neutral-200">
                          <TrashIcon className="w-5 h-5"/>
                        </div>
                      </Link>}
                  </div>
                </div>

                <div className="px-3">
                  <Viewer content={board.content}/>
                </div>
              </div>
            )}
          </div>
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

  // Get the paths we want to pre-render based on posts
  const paths = boards.map((board) => ({
    params: { id: board.id.toString() }
  }))

  return { paths, fallback: 'blocking' }
}

export default BoardView
