import type { NextPage } from 'next'

import { createRef, FormEvent, forwardRef, useEffect, useState } from 'react'

import Container from '../components/Container'
import PageAnimation from '../components/PageAnimation'

import dynamic from 'next/dynamic'
import { PencilIcon } from '@heroicons/react/outline'

import 'prismjs/themes/prism-tomorrow.css'
import '@toast-ui/chart/dist/toastui-chart.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'
import PublishModal from '../components/PublishModal'

const Editor = dynamic(() => import('../components/Editor'), { ssr: false })

// eslint-disable-next-line react/display-name
const EditorWithForwardedRef = forwardRef<any>((props, ref) => (
  <Editor {...props} forwardedRef={ref} />
)) as any

const EditPage: NextPage = () => {
  const editorRef = createRef<any>()

  const [content, setContent] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    (async () => {
      const data = await fetch(`/api/board/${new URL(window.location.href).searchParams.get('id')}`)
        .then((res) => res.json())

      editorRef.current?.getInstance().setMarkdown(data.board.content)
      setContent(data.board.content)
    })()
  }, [])

  async function addImageBlobHook (blob: Blob, callback: any) {
    const formData = new FormData()
    formData.append('file', blob)

    const data = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    }).then((res) => res.json())

    callback(data.url)
  }

  function onSubmit (e: FormEvent) {
    e.preventDefault()
    setContent(editorRef.current.getInstance().getMarkdown())
    setModalOpen(true)
  }

  return (
    <PageAnimation>
      <Container>
        <form onSubmit={onSubmit} className="flex h-full gap-5 px-3 py-10">
          <div className="bg-white shadow grow">
            <EditorWithForwardedRef
              previewStyle="vertical"
              initialValue={content}
              height="100%"
              hooks={{ addImageBlobHook }}
              initialEditType="markdown"
              useCommandShortcut={true}
              ref={editorRef}
            />
            <div className="relative text-right -top-32 right-32">
              <button type="submit" className="absolute inline-block p-4 transition-all rounded-full shadow-lg cursor-pointer hover:shadow-inner text-neutral-100 bg-neutral-700 hover:bg-neutral-900">
                <PencilIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </form>
      </Container>

      {typeof window !== 'undefined' &&
        <PublishModal
          id={new URL(window.location.href).searchParams.get('id')!}
          content={content}
          isOpen={modalOpen}
          onRequestClose={() => setModalOpen(false)}/>}
    </PageAnimation>
  )
}

export default EditPage
