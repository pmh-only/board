import { NextPage } from 'next'
import Container from '../../components/Container'
import { CheckCircleIcon } from '@heroicons/react/outline'

/** Github OAuth 로그인 성공 페이지 */
const LoginSuccess: NextPage = () =>
  <Container className="flex flex-col items-center text-neutral-600">
    <CheckCircleIcon className="w-1/3 text-neutral-300" />
    <h1 className="text-lg">로그인에 성공하였습니다!</h1>
    <p className="text-sm">이제 이 탭을 닫아도 됩니다.</p>
  </Container>

export default LoginSuccess
