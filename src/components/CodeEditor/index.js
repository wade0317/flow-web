import React, { Component } from 'react'
import PropTypes from 'prop-types'

import EventListener from 'react-event-listener'
import debounce from 'lodash/debounce'
import MonacoEditor from 'react-monaco-editor'
import { dark } from './theme'

import classnames from 'classnames'
import classes from './editor.scss'

const requireConfig = {
  url: '/vs/loader.js',
  paths: {
    vs: '/vs',
  }
}
let defineTheme = false

const defaultOptions = {
  lineNumbers: true,
  roundedSelection: false,
  minimap: {
    enabled: false,
  },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineHeight: 25,
}

export default class CodeEditor extends Component {
  static propTypes = {
    // value: PropTypes.string,
    // language: PropTypes.string,
    theme: PropTypes.string,
    className: PropTypes.string,
    readOnly: PropTypes.bool,
    options: PropTypes.bool,
    // onChange: PropTypes.func,
  }

  static defaultProps = {
    language: 'yaml',
    theme: 'dark',
  }

  componentDidMount () {
    this.debounceHandleResize = debounce(this.handleResize, 300)
  }

  getOptions (props = this.props) {
    const { options, readOnly } = props
    return {
      ...defaultOptions,
      ...options,
      readOnly,
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.editor) {
      return
    }
    if (this.props.readOnly !== nextProps.readOnly) {
      this.editor.updateOptions(this.getOptions(nextProps))
    }
  }

  editorWillMount = (monaco) => {
    if (defineTheme) {
      return
    }
    monaco.editor.defineTheme('dark', dark)
    defineTheme = true
  }

  editorDidMount = (editor, monaco) => {
    editor.getModel().updateOptions({ tabSize: 2 })
    this.editor = editor
  }

  handleResize = () => {
    this.editor && this.editor.layout()
  }

  render () {
    const { className, theme } = this.props
    const options = this.getOptions()
    return <div className={classnames(classes.editor, className, theme)}>
      <EventListener target='window' onResize={this.debounceHandleResize} />
      <MonacoEditor {...this.props} options={options} width='100%' height='500'
        editorWillMount={this.editorWillMount}
        editorDidMount={this.editorDidMount}
        requireConfig={requireConfig} />
    </div>
  }
}
