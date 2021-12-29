import { NextPage } from 'next'

interface Props {
  className?: string
}

const Container: NextPage<Props> = ({ children, className }) =>
  <div className="flex justify-center w-full">
    <div className={`container px-2 h-full ${className || ''}`}>
      {children}
    </div>
  </div>

export default Container
