import type { NextPage } from 'next'

import Link from 'next/link'
import { parse } from 'cookie'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { HomeIcon, LoginIcon, LogoutIcon, PencilIcon } from '@heroicons/react/outline'

import Container from './Container'
import ReactTooltip from 'react-tooltip'

const HeaderNav: NextPage = () => {
  const router = useRouter()
  const [isLogined, setLogined] = useState<boolean | null>(null)

  useEffect(() => {
    async function fn () {
      const cookies = parse(document.cookie)

      if (!cookies.token) return setLogined(false)

      const res = await fetch('/api/auth/check')
        .then((res) => res.json())

      if (!res.success) return setLogined(false)

      setLogined(true)
    }

    fn()
    router.events.on('routeChangeStart', fn)
  }, [])

  return (
    <nav className="sticky top-0 z-40 shadow bg-neutral-50">
      <Container className="max-w-6xl">
        <div className="flex justify-between">
          <div className="flex">
            <Link href="/" passHref>
              <div data-tip="홈으로 돌아갑니다." className="inline-flex items-center gap-1 px-3 py-2 cursor-pointer hover:bg-neutral-200 text-neutral-700">
                <HomeIcon className="w-5 h-5"/> {process.env.NEXT_PUBLIC_SITE_NAME}
              </div>
            </Link>
          </div>

          {isLogined !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex">
              {!isLogined &&
                <Link href="/login" passHref>
                  <div data-tip="로그인" className="inline-flex items-center gap-1 px-3 py-2 cursor-pointer hover:bg-neutral-200 text-neutral-700">
                    <LoginIcon className="w-5 h-5"/>
                  </div>
                </Link>}

              {isLogined &&
                <Link href="/new" passHref>
                  <div data-tip="글쓰기" className="inline-flex items-center gap-1 px-3 py-2 cursor-pointer hover:bg-neutral-200 text-neutral-700">
                    <PencilIcon className="w-5 h-5"/>
                  </div>
                </Link>}

              {isLogined &&
                <Link href="/logout" passHref>
                  <div data-tip="로그아웃" className="inline-flex items-center gap-1 px-3 py-2 cursor-pointer hover:bg-neutral-200 text-neutral-700">
                    <LogoutIcon className="w-5 h-5"/>
                  </div>
                </Link>}
            </motion.div>
          )}
        </div>
      </Container>
      <ReactTooltip place="bottom" effect="solid"/>
    </nav>
  )
}

export default HeaderNav
