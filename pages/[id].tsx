import { EyeIcon, PencilAltIcon, RefreshIcon, TrashIcon, XCircleIcon } from '@heroicons/react/outline'
import moment from 'moment'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'

import 'prismjs/themes/prism-tomorrow.css'
import '@toast-ui/chart/dist/toastui-chart.css'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'

import Container from '../components/Container'
import PageAnimation from '../components/PageAnimation'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { parse } from 'cookie'
import ReactTooltip from 'react-tooltip'

const Viewer = dynamic(() => import('../components/Viewer'), { ssr: false })

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const Logout: NextPage = () => {
  const router = useRouter()
  const [editBtnVisiable, setEditBtnVisiable] = useState(false)
  const { data, error } = useSWR(`/api/board/${router.query.id}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  useEffect(() => {
    (async () => {
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
        <title>{data && data.success ? data.board.title : 'board view'} - {process.env.NEXT_PUBLIC_SITE_NAME}</title>
        <meta name="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME}/>
        <meta name="theme-color" content="#CBCBCB"/>
        <meta name="twitter:card" content="summary_large_image"/>

        {data && data.success && (
          <>
            <meta property="og:title" content={data.board.title}/>
            <meta property="og:description" content={data.board.content}/>
            <meta property="og:image" content={data.board.image || `https://picsum.photos/200?blur#${data.board.id}`}/>
          </>
        )}
      </Head>

      <Container className="max-w-4xl">
        <div className="flex min-h-full py-5">
          <div className="bg-white rounded shadow grow">

            {!data && !error &&
              <div className="flex items-center justify-center h-full gap-1 text-sm text-neutral-500">
                <RefreshIcon className="w-5 h-5 animate-spin"/> 로딩중...
              </div>}

            {error &&
              <div className="flex items-center justify-center h-full gap-1 text-sm text-red-400">
                <XCircleIcon className="w-5 h-5"/> 오류가 발생하였습니다.
              </div>}

            {data && !data.success &&
              <div className="flex items-center justify-center h-full gap-1 text-sm text-neutral-500">
                <XCircleIcon className="w-5 h-5"/> 없는 페이지입니다.
              </div>}

            {data && data.success && (
              <div>
                <div className="sticky flex items-center justify-between px-5 py-2 border-b top-10 bg-neutral-100">
                  <div className="flex items-end gap-3">
                    <h1 className="text-xl font-bold">{data.board.title}</h1>
                    <p className="py-1 text-xs text-neutral-500">{moment(data.board.created_at).format('YYYY년 MM월 DD일')}</p>
                    <p className="flex items-end gap-1 py-1 text-xs text-neutral-500"><EyeIcon className="w-3 h-3"/> {data.board.views}</p>
                  </div>
                  <div className="flex gap-1 text-neutral-500">
                    {editBtnVisiable &&
                      <Link passHref href={`/edit?id=${router.query.id}`}>
                        <div data-tip="수정" className="p-1 transition-all rounded cursor-pointer hover:bg-neutral-200">
                          <PencilAltIcon className="w-5 h-5"/>
                        </div>
                      </Link>}

                    {editBtnVisiable &&
                      <Link passHref href={`/delete?id=${router.query.id}`}>
                        <div data-tip="삭제" className="p-1 transition-all rounded cursor-pointer hover:bg-neutral-200">
                          <TrashIcon className="w-5 h-5"/>
                        </div>
                      </Link>}
                  </div>
                </div>

                <div className="px-3">
                  <Viewer content={data.board.content}/>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </PageAnimation>
  )
}

export default Logout
