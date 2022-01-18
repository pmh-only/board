import { NextPage } from 'next'

interface Props {
  className?: string
}

/**
 * 모든 내용물을 감싸는 컴포넌트입니다.
 *
 * 마진과 페딩을 적절하게 주어 시야를 중앙으로 모으는 역할을 합니다.
 * 또한 반응형 웹디자인, 모바일 환경 지원을 위한 초석입니다.
 */
const Container: NextPage<Props> = ({ children, className }) =>
  <div className="flex justify-center w-full">
    <div className={`container px-2 h-full ${className || ''}`}>
      {children}
    </div>
  </div>

export default Container
