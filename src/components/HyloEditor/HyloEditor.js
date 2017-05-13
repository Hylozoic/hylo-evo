import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createHashtagPlugin from './hashtagPlugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import { EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import 'draft-js/dist/Draft.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import './HyloEditor.scss'

const mentionPlugin = createMentionPlugin({
  // TODO: Map to local CSS Modules stylesheet (copy from plugin)
  // theme: styles
})
const hashtagPlugin = createHashtagPlugin()
const linkifyPlugin = createLinkifyPlugin()

const { MentionSuggestions } = mentionPlugin
const { CompletionSuggestions: HashtagSuggestions } = hashtagPlugin

const plugins = [
  mentionPlugin,
  hashtagPlugin,
  linkifyPlugin
]

export default class HyloEditor extends Component {
  static propTypes = {
    mentionResults: PropTypes.instanceOf(Immutable.List),
    hashtagResults: PropTypes.instanceOf(Immutable.List),
    placeholder: PropTypes.string,
    className: PropTypes.string,
    debug: PropTypes.bool,
    onChange: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  getContent = () => {
    const { editorState } = this.state
    return stateToHTML(editorState.getCurrentContent())
  }

  handleEditorChange = (editorState) => {
    if (this.props.debug) console.log(this.getContent())
    this.setState({ editorState })
    if (this.props.onChange) this.props.onChange(editorState)
  }

  handleMentionsSearch = ({ value }) => {
    return this.props.findMentions(value)
  }

  handleHashtagSearch = ({ value }) => {
    return this.props.findHashtags(value)
  }

  handleReturn = (event) => {
    const { submitOnReturnHandler } = this.props
    if (submitOnReturnHandler && !this.mentionsOpen) {
      if (!event.shiftKey) {
        submitOnReturnHandler(this.getContent())
        this.setState({
          editorState: EditorState.moveFocusToEnd(EditorState.createEmpty())
        })
        return 'handled'
      }
      return 'not-handled'
    }
  }

  handleMentionsOpen = () => {
    this.mentionsOpen = true
  }

  handleMentionsClose = () => {
    this.props.clearMentions()
    this.mentionsOpen = false
  }

  focus = () => {
    this.editor.focus()
  }

  render () {
    return <div styleName='wrapper' className={this.props.className}>
      <Editor
        ref={x => { this.editor = x }}
        editorState={this.state.editorState}
        onChange={this.handleEditorChange}
        placeholder={this.props.placeholder}
        handleReturn={this.handleReturn}
        plugins={plugins} />
      <MentionSuggestions
        onSearchChange={this.handleMentionsSearch}
        suggestions={this.props.mentionResults}
        onOpen={this.handleMentionsOpen}
        onClose={this.handleMentionsClose} />
      <HashtagSuggestions
        onSearchChange={this.handleHashtagSearch}
        suggestions={this.props.hashtagResults} />
    </div>
  }
}
