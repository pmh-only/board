import moment from 'moment'
import Head from 'next/head'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { ExclamationCircleIcon, EyeIcon, PencilAltIcon, TrashIcon, XCircleIcon } from '@heroicons/react/outline'

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
import useSWR from 'swr'
import Spinner from '../components/Spinner'
import toast from 'react-hot-toast'

const Viewer = dynamic(() => import('../components/Viewer'), { ssr: false })

interface Props {
  board: Board
}

const fetcher = (url: string) => fetch(url).then((res) => res.json())

const BoardView: NextPage<Props> = ({ board }) => {
  const [content, setContent] = useState('')
  const [editBtnVisiable, setEditBtnVisiable] = useState(false)
  const image = useRef(/!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g.exec(board.content)?.[1])

  const { data: commentData, error, mutate } = useSWR(`/api/board/${board.id}/comments`, fetcher)

  useEffect(() => {
    fetch(`/api/view?id=${board.id}`)

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

  async function commentByIp () {
    if (content.length < 1) return

    toast.promise(new Promise((resolve, reject) => {
      fetch(`/api/board/${board.id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ type: 'IP', content })
      }).then((res) => res.json()).then((res) => res.success ? resolve(null) : reject(res.error))
    }), {
      error: '댓글 작성은 1분당 한번만 가능합니다',
      success: '댓글이 작성되었습니다',
      loading: '댓글 작성 처리중...'
    }).then(() => setContent(''))

    mutate()
  }

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
                <div className="sticky z-40 flex items-center justify-between px-5 py-2 border-b rounded-t-lg top-10 bg-neutral-100">
                  <div className="flex items-end gap-3">
                    <h1 className="text-xl font-bold">{board.title}</h1>
                    <p className="py-1 text-xs text-neutral-500">{moment(board.created_at).format('YYYY년 MM월 DD일')}</p>
                    <p className="flex items-end gap-1 py-1 text-xs text-neutral-500"><EyeIcon className="w-3 h-3"/> {board.views}</p>
                  </div>
                  <div className="flex gap-1 text-neutral-500">
                    {editBtnVisiable &&
                      <Link passHref href={`/edit?id=${board.id}`}>
                        <div data-tip="수정" className="p-1 transition-all rounded-lg cursor-pointer hover:bg-neutral-200">
                          <PencilAltIcon className="w-5 h-5"/>
                        </div>
                      </Link>}

                    {editBtnVisiable &&
                      <Link passHref href={`/delete?id=${board.id}`}>
                        <div data-tip="삭제" className="p-1 transition-all rounded-lg cursor-pointer hover:bg-neutral-200">
                          <TrashIcon className="w-5 h-5"/>
                        </div>
                      </Link>}
                  </div>
                </div>

                <div className="px-5 py-2">
                  <Viewer content={board.content}/>
                </div>
              </div>
            )}
          </div>

          {board && (
            <div className="bg-white rounded-lg shadow">
              <div className="px-4 py-2 border-b rounded-t-lg top-10 bg-neutral-100">
                <div className="flex items-end gap-1">
                  <h1 className="text-xl font-bold">댓글</h1>
                  <p className="py-0.5 text-xs text-neutral-500">Comments.</p>
                </div>
              </div>
              <div>
                {!commentData && (
                  <div className="flex items-center justify-center gap-2 py-10 text-neutral-500">
                    <Spinner /> <div>댓글을 로딩중이에요!</div>
                  </div>
                )}

                {error && (
                  <div className="flex items-center justify-center gap-1 py-10 text-red-500">
                    <ExclamationCircleIcon className="w-5 h-5"/><div>댓글을 불러오는데 실패했어요</div>
                  </div>
                )}

                {commentData && !commentData.comments.length && (
                  <div className="py-10 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-1">
                      <XCircleIcon className="w-5 h-5"/><div>댓글이 없어요.. 힝힝...ㅠㅠ</div>
                    </div>
                    <span className="text-xs">(뭐라도 적어줘요)</span>
                  </div>
                )}

                {commentData && commentData.comments.length > 0 && commentData.comments.filter((v: any) => !v.reply_id).map((v: any, i: number) => (
                  <div key={i} className="items-center justify-center px-5 py-3 transition-colors border-b hover:bg-neutral-50">
                    <div className="text-md text-neutral-700">{v.author} <span className="inline-flex items-center text-xs text-neutral-500">{moment(v.created_at).format('YYYY년 MM월 DD일')}</span></div>
                    <div className="text-sm text-neutral-500">{v.content}</div>
                  </div>
                ))}
              </div>
              <form className="flex gap-2 p-2">
                <textarea autoComplete="off" value={content} onChange={(e) => setContent(e.target.value)} placeholder="여기를 눌러 댓글 작성을 시작하세요." className="w-full p-3 text-sm border rounded-lg outline-none resize-none focus:border-neutral-700"></textarea>
                <div className="flex flex-col gap-2">
                  <button type="button" onClick={commentByIp} className="p-1 text-sm transition-colors border rounded-lg hover:bg-neutral-700 hover:text-white">익명으로 작성</button>
                  <button className="p-1 text-sm transition-colors border rounded-lg hover:bg-neutral-700 hover:text-white">Github계정으로 작성</button>
                </div>
              </form>
            </div>
          )}
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
