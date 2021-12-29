import { EyeIcon, RefreshIcon, XCircleIcon } from '@heroicons/react/outline'
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

const Viewer = dynamic(() => import('../components/Viewer'), { ssr: false })

const fetcher = (url: string) => fetch(url).then((r) => r.json())

const Logout: NextPage = () => {
  const router = useRouter()
  const { data, error } = useSWR(`/api/board/${router.query.id}`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  })

  return (
    <PageAnimation>
      <Head>
        <title>{data && data.success ? data.board.title : 'board view'} - {process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>

      <Container className="max-w-4xl">
        <div className="flex min-h-full py-5">
          <div className="bg-white rounded shadow grow">

            {!data && !error &&
              <div className="flex justify-center gap-1 text-sm text-neutral-500 items-center h-full">
                <RefreshIcon className="w-5 h-5 animate-spin"/> 로딩중...
              </div>}

            {error &&
              <div className="flex justify-center gap-1 text-sm text-red-400 items-center h-full">
                <XCircleIcon className="w-5 h-5"/> 오류가 발생하였습니다.
              </div>}

            {data && !data.success &&
              <div className="flex justify-center gap-1 text-sm text-neutral-500 items-center h-full">
                <XCircleIcon className="w-5 h-5"/> 없는 페이지입니다.
              </div>}

            {data && data.success && (
              <div>
                <div className="sticky top-10">
                  <div className="flex items-end gap-3 px-5 py-2 bg-neutral-100 border-b">
                    <h1 className="text-xl font-bold">{data.board.title}</h1>
                    <p className="py-1 text-xs text-neutral-500">{moment(data.board.created_at).format('YYYY년 MM월 DD일')}</p>
                    <p className="flex items-end gap-1 py-1 text-xs text-neutral-500"><EyeIcon className="w-3 h-3"/> {data.board.views}</p>
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
