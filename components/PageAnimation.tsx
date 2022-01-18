import type { NextPage } from 'next'

import { motion } from 'framer-motion'

/** 페이지 전환 에니메이션을 위한 컴포넌트입니다. */
const PageAnimation: NextPage = ({ children }) =>
  <motion.main
    className="flex w-full grow"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}>

    {children}

  </motion.main>

export default PageAnimation
