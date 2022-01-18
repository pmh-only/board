/* eslint-disable @next/next/no-img-element */
import NextImage from 'next/image'
import { NextPage } from 'next'
import { useState } from 'react'

import * as style from './Image.style'

interface Props {
  url?: string
  alt: string
}

/**
 * 외부 이미지를 표시하는 컴포넌트입니다.
 *
 * 이미지가 로딩이 덜 되었을 경우 로딩 이미지를 표시하며
 * 로딩이 완료된 후 원래 이미지가 표시됩니다.
 */
const Image: NextPage<Props> = ({ url, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false)

  return (
    <div className="flex justify-center">

      {!isLoaded &&
        <NextImage // loading image
          className="rounded-t-lg"
          src="/loading.png"
          width={160} height={160} />}

      <img // loaded image
        src={url} alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={style.rawImage(isLoaded)}/>

    </div>
  )
}

export default Image
