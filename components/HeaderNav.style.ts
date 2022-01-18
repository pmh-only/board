import cntl from 'cntl'

export const navbarOuter = cntl`
  sticky top-0 z-40
  shadow
  bg-neutral-50
`

export const navbarIcon = cntl`
  px-3 py-2
  inline-flex items-center gap-1
  cursor-pointer text-neutral-700

  hover:bg-neutral-200
`
