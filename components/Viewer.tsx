import Prism from 'prismjs'
import { NextPage } from 'next'

import 'prismjs/themes/prism-tomorrow.css'
import '@toast-ui/chart/dist/toastui-chart.css'
import '@toast-ui/editor/dist/toastui-editor-viewer.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'

import uml from '@toast-ui/editor-plugin-uml'
import chart from '@toast-ui/editor-plugin-chart'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'

import { Viewer as ToastViewer } from '@toast-ui/react-editor'

interface Props {
  content: string
}

/**
 * NHN의 Toast.UI에서 제공하는 뷰어를 가져오는 컴포넌트입니다.
 *
 * Next.js 지원을 위한 여러가지 설정이 되어있습니다.
 *
 * NOTE: 이 컴포넌트는 SSR를 지원하지 않습니다.
 */
const Viewer: NextPage<Props> = ({ content }) =>
  <ToastViewer
    initialValue={content}
    plugins={[
      uml,
      chart,
      tableMergedCell,
      [codeSyntaxHighlight, { highlighter: Prism }]
    ]}/>

export default Viewer
