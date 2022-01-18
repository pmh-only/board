import type { NextPage } from 'next'

import Link from 'next/link'
import { parse } from 'cookie'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import ReactTooltip from 'react-tooltip'
import { useEffect, useState } from 'react'
import {
  HomeIcon,
  LoginIcon,
  LogoutIcon,
  PencilIcon
} from '@heroicons/react/outline'

import Container from './Container'
import { fetchJSON } from '../utils/io'

import * as style from './HeaderNav.style'

/**
 * 최상단에 위치하는 네비게이션 바입니다.
 *
 * 로그인 여/부를 계산하며
 * 홈화면 버튼과 로그인, 로그아웃, 글쓰기 버튼이 있습니다.
 */
const HeaderNav: NextPage = () => {
  const router = useRouter()
  const [isLogined, setLogined] = useState<boolean | null>(null)

  useEffect(() => {
    tokenVerify()
    router.events.on('routeChangeStart', tokenVerify)
  }, [router.events])

  async function tokenVerify () {
    const { token } = parse(document.cookie)

    if (!token) {
      setLogined(false)
      ReactTooltip.rebuild()
      return
    }

    const res = await fetchJSON('/api/auth/check')

    if (!res.success) {
      setLogined(false)
      ReactTooltip.rebuild()
      return
    }

    setLogined(true)
    ReactTooltip.rebuild()
  }

  return (
    <nav className={style.navbarOuter}>
      <Container className="max-w-6xl">
        <div className="flex justify-between">

          <div className="flex">
            <Link href="/" passHref>
              <div data-tip="홈으로 돌아가기" className={style.navbarIcon}>
                <HomeIcon className="w-5 h-5"/>
                <p>{process.env.NEXT_PUBLIC_SITE_NAME}</p>
              </div>
            </Link>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex">

            {!isLogined &&
              <Link href="/login" passHref>
                <div data-tip="로그인" className={style.navbarIcon}>
                  <LoginIcon className="w-5 h-5"/>
                </div>
              </Link>}

            {isLogined &&
              <Link href="/new" passHref>
                <div data-tip="글쓰기" className={style.navbarIcon}>
                  <PencilIcon className="w-5 h-5"/>
                </div>
              </Link>}

            {isLogined &&
              <Link href="/logout" passHref>
                <div data-tip="로그아웃" className={style.navbarIcon}>
                  <LogoutIcon className="w-5 h-5"/>
                </div>
              </Link>}

          </motion.div>
        </div>
      </Container>
    </nav>
  )
}

export default HeaderNav
