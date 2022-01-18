import moment from 'moment'
import Image from './Image'
import Link from 'next/link'
import { NextPage } from 'next'
import { Board } from 'knex/types/tables'
import ScrollContainer from 'react-indiana-drag-scroll'
import { ClockIcon, EyeIcon } from '@heroicons/react/outline'

import * as style from './BoardList.style'

interface Props {
  data: any
}

type Data = Board & { image?: string }

/**
 * 게시글 목록을 그리드로 보여주는 컴포넌트입니다.
 */
const BoardList: NextPage<Props> = ({ data }) =>
  <div className="flex flex-wrap justify-center gap-6 my-5 lg:gap-8">
    {data && data.boards.map((v: Data) => (
      <Link key={v.id} href={'/' + v.id} passHref>
        <div className={style.boardGrid}>
          <Image url={v.image || `https://picsum.photos/200?blur#${v.id}`} alt={v.title} />

          <div className="flex flex-col gap-1 px-5 py-3">
            <h1 className="text-xl font-bold">{v.title}</h1>

            <p className="overflow-hidden text-sm break-all text-neutral-500 text-ellipsis whitespace-nowrap">
              {v.content || '본문이 없습니다'}
            </p>

            <p className="flex items-center gap-3 text-xs text-neutral-500">
              <p data-tip="작성일">
                <ClockIcon className="inline w-4 h-4"/>
                {moment(v.created_at).format('YYYY년 MM월 DD일')}
              </p>

              <p data-tip="조회수">
                <EyeIcon className="inline w-4 h-4" />
                {v.views}
              </p>
            </p>

            <ScrollContainer className="mt-1 overflow-x-hidden text-sm select-none text-neutral-700" style={{ wordBreak: 'keep-all' }}>
              {v.tags.split(',')
                .filter((tag) => tag)
                .map((tag, i) =>
                  <Link key={i} href={`/tags/${tag.trim()}`} passHref>
                    <span
                      data-tip="클릭하면 해당 테그가 있는 게시글만 표시합니다."
                      className="px-2 mr-1 transition-colors bg-blue-200 rounded-full hover:bg-blue-300">
                      #{tag.trim()}
                    </span>
                  </Link>
                )}
            </ScrollContainer>
          </div>
        </div>
      </Link>
    ))}
  </div>

export default BoardList
