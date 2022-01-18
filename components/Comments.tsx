import useSWR from 'swr'
import moment from 'moment'
import Link from 'next/link'
import { NextPage } from 'next'
import { useState } from 'react'
import toast from 'react-hot-toast'
import {
  TrashIcon,
  XCircleIcon,
  ExclamationCircleIcon
} from '@heroicons/react/outline'

import Spinner from './Spinner'
import { fetchJSON, fetchJSONBody } from '../utils/io'

interface Props {
  id: number
  isAdmin: boolean
}

const Comments: NextPage<Props> = ({ id, isAdmin }) => {
  const [content, setContent] = useState('')
  const { data, error, mutate } = useSWR(`/api/board/${id}/comments`, fetchJSON)

  async function commentAdd (type: string) {
    if (content.length < 1) {
      toast.error('댓글 내용을 입력해주세요.', { position: 'bottom-center' })
      return
    }

    const promise = new Promise((resolve, reject) =>
      fetchJSONBody(`/api/board/${id}/comments`, { type, content })
        .then((res) =>
          res.success
            ? resolve(null)
            : reject(res.message)))

    const errorHandler =
      (error: string) =>
        error !== 'GITHUB_TOKEN_ERROR'
          ? '댓글 작성은 1분당 한번만 가능합니다'
          : '깃허브 로그인이 필요합니다.'

    try {
      await toast.promise(promise, {
        error: errorHandler,
        success: '댓글이 작성되었습니다',
        loading: '댓글 작성 처리중...'
      }, { position: 'bottom-center' })

      setContent('')
      mutate()
    } catch (error) {
      if (error === 'GITHUB_TOKEN_ERROR') {
        window.open('/api/auth/github')
      }
    }
  }

  async function deleteComment (id: number) {
    const promise = new Promise((resolve, reject) =>
      fetch(`/api/board/${id}/comments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      }).then(() => resolve(null)))

    try {
      await toast.promise(promise, {
        error: '권한이 부족합니다',
        success: '댓글이 삭제되었습니다',
        loading: '댓글 삭제 처리중...'
      }, { position: 'bottom-center' })

      mutate()
    } catch (_) {}
  }

  return (
    <div className="bg-white rounded-lg shadow">

      <div className="px-4 py-2 border-b rounded-t-lg top-10 bg-neutral-100">
        <div className="flex items-end gap-1">
          <h1 className="text-xl font-bold text-neutral-700">댓글</h1>
          <p className="py-0.5 text-xs text-neutral-500">Comments.</p>
        </div>
      </div>

      <div>
        {!data && (
          <div className="flex items-center justify-center gap-2 py-10 text-neutral-500">
            <Spinner />
            <div>댓글을 로딩중이에요!</div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center gap-1 py-10 text-red-500">
            <ExclamationCircleIcon className="w-5 h-5"/>
            <div>댓글을 불러오는데 실패했어요</div>
          </div>
        )}

        {data && !data.comments.length && (
          <div className="py-10 text-center text-neutral-500">
            <div className="flex items-center justify-center gap-1">
              <XCircleIcon className="w-5 h-5"/>
              <div>댓글이 없어요.. 힝힝...ㅠㅠ</div>
            </div>
            <span className="text-xs">(뭐라도 적어줘요)</span>
          </div>
        )}

        {data &&
          data.comments.length > 0 &&
          data.comments
            .filter((v: any) => !v.reply_id)
            .map((v: any, i: number) => (
              <div key={i} className="items-center justify-center px-5 py-3 transition-colors border-b hover:bg-neutral-50">
                <div className="flex gap-1 text-sm text-neutral-700">

                  {!v.author.startsWith('@')
                    ? v.author
                    : <Link href={`https://github.com/${v.author.slice(1)}`} passHref>
                        <b data-tip="Github 프로필로 이동" className="cursor-pointer">{v.author}</b>
                      </Link>}

                  <span className="inline-flex items-center text-xs text-neutral-500">
                    {moment(v.created_at).format('YYYY년 MM월 DD일 hh:mm')}
                  </span>

                  {isAdmin &&
                    <button
                      className="transition-colors hover:text-red-400"
                      onClick={() => deleteComment(v.id)}>
                        <TrashIcon className="w-4 h-4" />
                    </button>}

                </div>

                <div className="text-sm text-neutral-500">{v.content}</div>
              </div>
            ))}

      </div>

      <form className="flex gap-2 p-2">
        <textarea
          value={content}
          autoComplete="off"
          onChange={(e) => setContent(e.target.value)}
          placeholder="여기를 눌러 댓글 작성을 시작하세요."
          className="w-full p-3 text-sm border rounded-lg outline-none resize-none focus:border-neutral-700"/>

        <div className="flex flex-col gap-2">

          <button
            type="button"
            onClick={() => commentAdd('IP')}
            className="p-1 text-sm transition-colors border rounded-lg hover:bg-neutral-700 hover:text-white">
              익명으로 작성
          </button>

          <button
            type="button"
            onClick={() => commentAdd('Github')}
            className="p-1 text-sm transition-colors border rounded-lg hover:bg-neutral-700 hover:text-white">
              Github계정으로 작성
          </button>

        </div>
      </form>
    </div>
  )
}

export default Comments
