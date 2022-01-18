import cntl from 'cntl'

export const form = cntl`
  pt-16
  absolute z-50
  w-screen h-screen
  flex items-start justify-center
  bg-black bg-opacity-25 backdrop-blur
`

export const modalInner = cntl`
  p-5
  flex flex-col gap-3
  bg-white
  rounded-lg
  shadow
`

export const inputOuter = cntl`
  px-3 py-2
  flex items-center
  outline outline-1 outline-neutral-400
  
  focus-within:outline-blue-400
`

export const submitBtn = cntl`
  px-3 py-2
  text-white
  bg-neutral-700
  flex items-center self-end gap-1
  
  hover:bg-neutral-800
`
