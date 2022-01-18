import '../styles/globals.css'
import type { AppProps } from 'next/app'

import Head from 'next/head'
import ReactTooltip from 'react-tooltip'
import { Toaster } from 'react-hot-toast'
import NextNprogress from 'nextjs-progressbar'
import { AnimatePresence } from 'framer-motion'

import HeaderNav from '../components/HeaderNav'

import '@fontsource/noto-sans-kr/index.css'
import '@fontsource/noto-sans-kr/700.css'
import Footer from '../components/Footer'

function MyApp ({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>{process.env.NEXT_PUBLIC_SITE_NAME}</title>
      </Head>

      <AnimatePresence exitBeforeEnter>
        <div className="flex flex-col min-h-screen">
          <HeaderNav />
          <Component {...pageProps}/>
        </div>
        <Footer />
      </AnimatePresence>

      <ReactTooltip place="bottom" effect="solid"/>
      <Toaster position="top-center"/>
      <NextNprogress
        height={2}
        color="#404040"
        options={{ showSpinner: false }}/>
    </>
  )
}

export default MyApp
