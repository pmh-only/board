import type { NextPage } from 'next'

import { createRef, FormEvent, forwardRef, useState } from 'react'

import Container from '../components/Container'
import PageAnimation from '../components/PageAnimation'

import dynamic from 'next/dynamic'
import { PencilIcon } from '@heroicons/react/outline'

import PublishModal from '../components/PublishModal'
import { fetchJSON } from '../utils/io'

const Editor = dynamic(() => import('../components/Editor'), { ssr: false })

// eslint-disable-next-line react/display-name
const EditorWithForwardedRef = forwardRef<any>((props, ref) => (
  <Editor {...props} forwardedRef={ref} />
)) as any

const NewPage: NextPage = () => {
  const editorRef = createRef<any>()

  const [content, setContent] = useState('')
  const [modalOpen, setModalOpen] = useState(false)

  function onSubmit (e: FormEvent) {
    e.preventDefault()
    setContent(editorRef.current.getInstance().getMarkdown())
    setModalOpen(true)
  }

  async function addImageBlobHook (blob: Blob, callback: any) {
    const formData = new FormData()
    formData.append('file', blob)

    const data = await fetchJSON('/api/upload', {
      method: 'POST',
      body: formData
    })

    callback(data.url)
  }

  return (
    <PageAnimation>
      <Container>
        <form onSubmit={onSubmit} className="flex h-full gap-5 px-3 py-10">
          <div className="bg-white shadow grow">
            <EditorWithForwardedRef
              previewStyle="vertical"
              height="100%"
              initialEditType="markdown"
              hooks={{ addImageBlobHook }}
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

      <PublishModal
        content={content}
        isOpen={modalOpen}
        onRequestClose={() => setModalOpen(false)}/>
    </PageAnimation>
  )
}

export default NewPage
