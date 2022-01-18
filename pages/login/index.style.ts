import cntl from 'cntl'

export const disabledInput = cntl`
  px-3 py-2
  flex items-center
  bg-gray-200
  
  outline
  outline-1
  outline-neutral-400

  focus:outline-none
  focus:outline-blue-400
`

export const enabledInput = cntl`
  px-3 py-2
  flex items-center

  outline
  outline-1
  outline-neutral-400
  
  focus-within:outline-blue-400
`

export const submitBtn = cntl`
  px-3 py-2
  self-end
  text-white bg-neutral-700
  
  hover:bg-neutral-800
`
