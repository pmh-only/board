import type { NextPage } from 'next'
import ReactModal from 'react-modal'

import { DocumentIcon, PencilAltIcon, TagIcon } from '@heroicons/react/outline'
import { FormEvent, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

interface Props {
  isOpen: boolean
  content: string
  id?: string
  onRequestClose: () => void
}

const PublishModal: NextPage<Props> = ({ isOpen, onRequestClose, content, id }) => {
  const router = useRouter()
  const [tags, setTags] = useState('')
  const [title, setTitle] = useState('')

  useEffect(() => {
    (async () => {
      if (!id) return

      const data = await fetch(`/api/board/${new URL(window.location.href).searchParams.get('id')}`)
        .then((res) => res.json())

      setTags(data.board.tags)
      setTitle(data.board.title)
    })()
  }, [])

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

    const data = await fetch(id ? `/api/board/${id}` : '/api/new', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title,
        content,
        tags
      })
    }).then((res) => res.json())

    if (!data.success) {
      toast.error('에러가 발생했습니다.')
      return
    }

    toast.success('저장되었습니다. 업로드까지 최대 10초 정도 걸릴 수 있습니다.')
    router.push(`/${data.id}`)
  }

  return (
    <ReactModal
      onRequestClose={onRequestClose}
      shouldCloseOnEsc
      shouldCloseOnOverlayClick
      className="p-0"
      isOpen={isOpen}>
      <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={onSubmit} onClick={(e) => e.target instanceof HTMLFormElement && onRequestClose()} id="modal-bg" className="absolute z-50 flex items-start justify-center w-screen h-screen pt-16 bg-black bg-opacity-25 backdrop-blur">
        <div className="flex flex-col gap-3 p-5 bg-white rounded-lg shadow">
          <h1 className="text-xl font-bold">글쓰기</h1>
          <div className="flex items-center px-3 py-2 mt-3 outline outline-1 outline-neutral-400 focus-within:outline-blue-400">
            <label htmlFor="title" className="flex items-center"><DocumentIcon className="inline w-5 h-5 mr-3"/></label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} id="title" type="text" placeholder="제목" autoComplete="off" className="w-56 bg-transparent focus:outline-none"/>
          </div>
          <div className="flex items-center px-3 py-2 outline outline-1 outline-neutral-400 focus-within:outline-blue-400">
            <label htmlFor="tag" className="flex items-center"><TagIcon className="inline w-5 h-5 mr-3"/></label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} id="tag" type="text" placeholder="태그 (쉼표로 구분)" autoComplete="off" className="w-56 bg-transparent focus:outline-none"/>
          </div>
          <button type="submit" className="flex items-center self-end gap-1 px-3 py-2 text-white bg-neutral-700 hover:bg-neutral-800"><PencilAltIcon className="inline-block w-5 h-5"/> 퍼블리쉬!</button>
        </div>
      </motion.form>
    </ReactModal>
  )
}

export default PublishModal
