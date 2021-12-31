import '../styles/globals.css'
import type { AppProps } from 'next/app'

import { Toaster } from 'react-hot-toast'
import NextNprogress from 'nextjs-progressbar'
import { AnimatePresence } from 'framer-motion'

import HeaderNav from '../components/HeaderNav'

import '@fontsource/noto-sans-kr/index.css'
import '@fontsource/noto-sans-kr/700.css'
import Head from 'next/head'
import ReactTooltip from 'react-tooltip'
import Container from '../components/Container'

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <AnimatePresence exitBeforeEnter>
      <div>
        <Head>
          <title>{process.env.NEXT_PUBLIC_SITE_NAME}</title>
        </Head>
        <div className="flex flex-col min-h-screen">
          <NextNprogress height={2} color="#404040" options={{ showSpinner: false }}/>
          <HeaderNav />
          <Component {...pageProps}/>
          <Toaster position="top-center"/>
        </div>
        <ReactTooltip place="bottom" effect="solid"/>
        <div className="py-8 text-sm font-thin bg-neutral-900 text-neutral-200">
          <Container>
            &copy; <a className="hover:underline" href="https://github.com/pmh-only/board">pmh-only/board</a> by <a className="hover:underline" href="https://pmh.codes">PMH</a>
          </Container>
        </div>
      </div>
    </AnimatePresence>
  )
}

export default MyApp
