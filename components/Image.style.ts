import cntl from 'cntl'

export const rawImage = (isLoaded: boolean) => cntl`
  w-full h-40
  rounded-lg rounded-b-none 
  object-cover
  
  ${isLoaded
    ? 'block'
    : 'hidden'}
`
