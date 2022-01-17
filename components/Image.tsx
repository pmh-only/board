/* eslint-disable @next/next/no-img-element */
import NextImage from 'next/image'
import { NextPage } from 'next'
import { useState } from 'react'

interface Props {
  url?: string
  alt: string
}

const Image: NextPage<Props> = ({ url, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="flex justify-center">
      {!isLoaded &&
        <NextImage className="rounded-t-lg" src="/loading.png" width={160} height={160} />}
      <img src={url} alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`rounded-lg rounded-b-none w-full h-40 object-cover ${isLoaded ? 'block' : 'hidden'}`}/>
    </div>
  )
}

export default Image
