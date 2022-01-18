import type { NextPage } from 'next'
import Container from './Container'

const Footer: NextPage = () =>
  <div className="py-8 text-sm font-thin bg-neutral-900 text-neutral-200">
    <Container>
      &copy;
      <a className="hover:underline" href="https://github.com/pmh-only/board">
        pmh-only/board
      </a>
      by
      <a className="hover:underline" href="https://pmh.codes">
        PMH
      </a>
    </Container>
  </div>

export default Footer
