import type { NextPage } from 'next'

import { FormEvent } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

import Container from '../components/Container'
import PageAnimation from '../components/PageAnimation'

const Logout: NextPage = () => {
  const router = useRouter()

  function onSubmit (e: FormEvent) {
    e.preventDefault()
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/')
    toast.success('로그아웃 되었습니다.')
  }

  return (
    <PageAnimation>
      <Container>
        <div className="flex justify-center py-10">
          <div className="p-5 bg-white rounded shadow select-none">
            <form onSubmit={onSubmit} className="flex flex-col gap-5 px-3 mt-5">
              <p>로그아웃 하시겠습니까?</p>
              <button type="submit" className="self-end px-3 py-2 text-white bg-neutral-700 hover:bg-neutral-800">로그아웃</button>
            </form>
          </div>
        </div>
      </Container>
    </PageAnimation>
  )
}

export default Logout
