import type { NextPage } from 'next'

import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { LockClosedIcon, UserIcon } from '@heroicons/react/outline'

import Container from '../components/Container'
import PageAnimation from '../components/PageAnimation'

const Login: NextPage = () => {
  const [password, setPassword] = useState('')
  const router = useRouter()

  function onSubmit (e: FormEvent) {
    e.preventDefault()

    const promise = new Promise<void>((resolve, reject) => {
      fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ password })
      }).then((res) => res.json())
        .then((res) => {
          if (!res.success) return reject(new Error())

          resolve()
          router.push('/')
        })
        .catch((err) => reject(err))
    })

    toast.promise(promise, {
      error: '비밀번호가 잘못 입력되었습니다.',
      success: '로그인 되었습니다.',
      loading: '로그인중...'
    })
  }

  return (
    <PageAnimation>
      <Container>
        <div className="flex justify-center py-10">
          <div className="p-5 bg-white rounded-lg shadow select-none">
            <h1 className="text-xl font-bold">로그인</h1>
            <form onSubmit={onSubmit} className="flex flex-col gap-3 px-3 mt-5">
              <div className="flex items-center px-3 py-2 bg-gray-200 focus:outline-none outline outline-1 outline-neutral-400 focus:outline-blue-400">
                <UserIcon className="inline w-5 h-5 mr-3"/>
                <input type="text" placeholder="아이디" value={process.env.NEXT_PUBLIC_ADMIN_USERNAME} className="bg-transparent" disabled/>
              </div>
              <div className="flex items-center px-3 py-2 outline outline-1 outline-neutral-400 focus-within:outline-blue-400">
                <label htmlFor="pw" className="flex items-center"><LockClosedIcon className="inline w-5 h-5 mr-3"/></label>
                <input onChange={(e) => setPassword(e.target.value)} id="pw" type="password" placeholder="비밀번호" autoComplete="off" className="bg-transparent focus:outline-none"/>
              </div>
              <button type="submit" className="self-end px-3 py-2 text-white bg-neutral-700 hover:bg-neutral-800">로그인</button>
            </form>
          </div>
        </div>
      </Container>
    </PageAnimation>
  )
}

export default Login
