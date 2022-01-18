import Prism from 'prismjs'
import PropTypes from 'prop-types'
import { Editor } from '@toast-ui/react-editor'

import uml from '@toast-ui/editor-plugin-uml'
import chart from '@toast-ui/editor-plugin-chart'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'

import 'prismjs/themes/prism-tomorrow.css'
import '@toast-ui/chart/dist/toastui-chart.css'
import '@toast-ui/editor/dist/toastui-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import '@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css'
import '@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css'

/**
 * NHN의 Toast.UI에서 제공하는 에디터를 가져오는 컴포넌트입니다.
 *
 * Next.js 지원을 위한 여러가지 설정이 되어있습니다.
 *
 * NOTE: 이 컴포넌트는 SSR를 지원하지 않습니다.
 */
const WrappedEditor = (props: any) => {
  const { forwardedRef } = props

  return <Editor
    {...props}
    ref={forwardedRef}
    usageStatistics={false}
    plugins={[
      uml,
      chart,
      tableMergedCell,
      [colorSyntax, props.colorSyntaxOptions],
      [codeSyntaxHighlight, { highlighter: Prism }]
    ]}
  />
}

WrappedEditor.propTypes = {
  props: PropTypes.object,
  forwardedRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element)
  }).isRequired
}

WrappedEditor.displayName = 'Editor'

export default WrappedEditor
