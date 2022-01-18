import type { NextPage } from 'next'
import { useRouter } from 'next/router'

import { FormEvent } from 'react'
import toast from 'react-hot-toast'

import Container from '../components/Container'
import PageAnimation from '../components/PageAnimation'

const DeletePage: NextPage = () => {
  const router = useRouter()

  async function onSubmit (e: FormEvent) {
    e.preventDefault()

    const data = await fetch(`/api/board/${router.query.id}`, {
      method: 'DELETE'
    }).then((res) => res.json())

    if (data.success) {
      toast.success('삭제되었습니다.')
      router.push('/')
    }
  }

  return (
    <PageAnimation>
      <Container>
        <div className="flex justify-center py-10">
          <div className="p-5 bg-white rounded-lg shadow select-none">
            <form onSubmit={onSubmit} className="flex flex-col gap-5 px-3 mt-5">
              <p>삭제하시겠습니까?</p>
              <button
                type="submit"
                className="self-end px-3 py-2 text-white bg-red-700 hover:bg-red-800">
                  삭제
              </button>
            </form>
          </div>
        </div>
      </Container>
    </PageAnimation>
  )
}

export default DeletePage
