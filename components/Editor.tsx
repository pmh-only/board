import PropTypes from 'prop-types'
import { Editor } from '@toast-ui/react-editor'
import Prism from 'prismjs'

import uml from '@toast-ui/editor-plugin-uml'
import chart from '@toast-ui/editor-plugin-chart'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import tableMergedCell from '@toast-ui/editor-plugin-table-merged-cell'
import codeSyntaxHighlight from '@toast-ui/editor-plugin-code-syntax-highlight'

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
