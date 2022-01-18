import cntl from 'cntl'

export const boardGrid = cntl`
  relative
  w-full
  shadow
  bg-white
  rounded-lg
  cursor-pointer
  transition-all
  
  md:max-w-xs
  
  outline-3
  outline-blue-200
  
  hover:outline 
  hover:shadow-md
  hover:bg-neutral-50
`
