import type { NextPage } from 'next'
import ReactModal from 'react-modal'

import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { FormEvent, useEffect, useState } from 'react'
import {
  TagIcon,
  DocumentIcon,
  PencilAltIcon
} from '@heroicons/react/outline'

import * as style from './PublishModal.style'
import { fetchJSON, fetchJSONBody } from '../utils/io'

interface Props {
  isOpen: boolean
  content: string
  id?: string
  onRequestClose: () => void
}

/**
 * 게시글 업로드전 한번더 물어보는 창입니다.
 *
 * 게시글의 제목, 테그를 입력받고 업로드를 요청합니다.
 */
const PublishModal: NextPage<Props> =
  ({ isOpen, onRequestClose, content, id }) => {
    const router = useRouter()
    const [tags, setTags] = useState('')
    const [title, setTitle] = useState('')

    useEffect(() => {
      (async () => {
        if (!id) return
        const data = await fetchJSON(`/api/board/${id}`)

        setTags(data.board.tags)
        setTitle(data.board.title)
      })()
    }, [id])

    async function onSubmit (e: FormEvent) {
      e.preventDefault()

      if (!title.trim()) {
        toast.error('제목을 입력해주세요.')
        return
      }

      if (title.length > 255) {
        toast.error('히익!! 제목이 너무 길어요...')
        return
      }

      if (tags.length > 255) {
        toast.error('태그가 너무 많아요...')
        return
      }

      const url = id
        ? `/api/board/${id}`
        : '/api/new'

      const data = await fetchJSONBody(url, {
        title, content, tags
      })

      if (!data.success) {
        toast.error('에러가 발생했습니다.')
        return
      }

      toast.success('저장되었습니다. 업로드까지 최대 10초 정도 걸릴 수 있습니다.')
      router.push('/' + data.id)
    }

    return (
    <ReactModal
      className="p-0"
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      onRequestClose={onRequestClose}
      isOpen={isOpen}>

      <motion.form
        onSubmit={onSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        id="modal-bg" className={style.form}
        onClick={(e) => e.target instanceof HTMLFormElement && onRequestClose()}>

        <div className={style.modalInner}>
          <h1 className="mb-3 text-xl font-bold">글쓰기</h1>

          <div className={style.inputOuter}>

            <label htmlFor="title" className="flex items-center">
              <DocumentIcon className="inline w-5 h-5 mr-3"/>
            </label>

            <input
              id="title"
              type="text"
              value={title}
              placeholder="제목"
              autoComplete="off"
              onChange={(e) => setTitle(e.target.value)}
              className="w-56 bg-transparent focus:outline-none"/>

          </div>

          <div className={style.inputOuter}>

            <label htmlFor="tag" className="flex items-center">
              <TagIcon className="inline w-5 h-5 mr-3"/>
            </label>

            <input
              id="tag"
              type="text"
              value={tags}
              autoComplete="off"
              placeholder="태그 (쉼표로 구분)"
              onChange={(e) => setTags(e.target.value)}
              className="w-56 bg-transparent focus:outline-none"/>

          </div>

          <button type="submit" className={style.submitBtn}>
            <PencilAltIcon className="inline-block w-5 h-5"/> 퍼블리쉬!
          </button>
        </div>
      </motion.form>
    </ReactModal>
    )
  }

export default PublishModal
