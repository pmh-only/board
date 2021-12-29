
import Prism from 'prismjs'

import uml from '@toast-ui/editor-plugin-uml'
import chart from '@toast-ui/editor-plugin-chart'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'
import { NextPage } from 'next'

import { Viewer as ToastViewer } from '@toast-ui/react-editor'

interface Props {
  content: string
}

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
