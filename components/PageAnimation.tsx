import type { NextPage } from 'next'

import { motion } from 'framer-motion'

const PageAnimation: NextPage = ({ children }) =>
  <motion.main className="flex w-full grow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
    {children}
  </motion.main>

export default PageAnimation
