/* eslint-disable prefer-promise-reject-errors */
import type { NextPage } from 'next'

import cntl from 'cntl'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { LockClosedIcon, UserIcon } from '@heroicons/react/outline'

import Container from '../../components/Container'
import PageAnimation from '../../components/PageAnimation'

import { fetchJSONBody } from '../../utils/io'

const style = {
  disabledInput: cntl`
    px-3 py-2
    flex items-center
    bg-gray-200
    
    outline
    outline-1
    outline-neutral-400
  
    focus:outline-none
    focus:outline-blue-400
  `,
  enabledInput: cntl`
    px-3 py-2
    flex items-center

    outline
    outline-1
    outline-neutral-400
    
    focus-within:outline-blue-400
  `,
  submitBtn: cntl`
    px-3 py-2
    self-end
    text-white bg-neutral-700
    
    hover:bg-neutral-800
  `
}

/**
 * 로그인 페이지입니다.
 *
 * 관리자는 이곳에서 로그인 하고 토큰을 발급받습니다.
 */
const Login: NextPage = () => {
  const router = useRouter()
  const [password, setPassword] = useState('')

  function onSubmit (e: FormEvent) {
    e.preventDefault()

    const promise = new Promise((resolve, reject) => {
      fetchJSONBody('/api/auth/login', { password })
        .then((res) => res.success ? resolve(null) : reject())
        .catch(() => reject())
    })

    toast.promise(promise, {
      error: '비밀번호가 잘못 입력되었습니다.',
      success: '로그인 되었습니다.',
      loading: '로그인중...'
    }).then(() => router.push('/'))
  }

  return (
    <PageAnimation>
      <Container>
        <div className="flex justify-center py-10">
          <div className="p-5 bg-white rounded-lg shadow select-none">
            <h1 className="text-xl font-bold">로그인</h1>

            <form onSubmit={onSubmit} className="flex flex-col gap-3 px-3 mt-5">

              <div className={style.disabledInput}>
                <UserIcon className="inline w-5 h-5 mr-3"/>

                <input
                  type="text"
                  placeholder="아이디"
                  className="bg-transparent" disabled
                  value={process.env.NEXT_PUBLIC_ADMIN_USERNAME}/>
              </div>

              <div className={style.enabledInput}>
                <label
                  htmlFor="pw"
                  className="flex items-center">
                    <LockClosedIcon className="inline w-5 h-5 mr-3"/>
                </label>

                <input
                  id="pw"
                  type="password"
                  autoComplete="off"
                  placeholder="비밀번호"
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-transparent focus:outline-none"/>
              </div>

              <button
                type="submit"
                className={style.submitBtn}>
                  로그인
              </button>
            </form>
          </div>
        </div>
      </Container>
    </PageAnimation>
  )
}

export default Login
