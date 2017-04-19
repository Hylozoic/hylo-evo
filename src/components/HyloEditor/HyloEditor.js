import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createHashtagPlugin from './hashtagPlugin'
import createLinkifyPlugin from 'draft-js-linkify-plugin'
import { EditorState, convertToRaw } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import 'draft-js/dist/Draft.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import './HyloEditor.scss'

const mentionPlugin = createMentionPlugin({
  // TODO: Map to local CSS Modules stylesheet (copy from plugin)
  // theme: styles
})
const hashtagPlugin = createHashtagPlugin({
  entityMutability: 'IMMUTABLE'
})
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
    debug: PropTypes.bool
  }

  constructor (props) {
    super(props)
    this.submitOnReturnEnabled = true
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  getContentHTML = () => {
    const { editorState } = this.state
    return stateToHTML(editorState.getCurrentContent())
  }

  getContentRaw = () => {
    const { editorState } = this.state
    return convertToRaw(editorState.getCurrentContent())
  }

  handleEditorChange = (editorState) => {
    if (this.props.debug) console.log(this.getContentRaw())
    this.setState({ editorState })
  }

  handleMentionsSearch = ({ value }) => {
    return this.props.findMentions(value)
  }

  handleHashtagSearch = ({ value }) => {
    return this.props.findHashtags(value)
  }

  handleReturn = (event) => {
    const { submitOnReturnHandler } = this.props
    if (submitOnReturnHandler && this.submitOnReturnEnabled) {
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

  enableSubmitOnReturn = () => {
    this.submitOnReturnEnabled = true
  }

  disableSubmitOnReturn = () => {
    this.submitOnReturnEnabled = false
  }

  handleMentionsClose = () => {
    this.props.clearMentions()
    this.enableSubmitOnReturn()
  }

  disableSubmitOnReturn

  render () {
    return <div styleName='wrapper' className={this.props.className}>
      <Editor
        editorState={this.state.editorState}
        onChange={this.handleEditorChange}
        placeholder={this.props.placeholder}
        handleReturn={this.handleReturn}
        plugins={plugins} />
      <MentionSuggestions
        onSearchChange={this.handleMentionsSearch}
        suggestions={this.props.mentionResults}
        onOpen={this.disableSubmitOnReturn}
        onClose={this.handleMentionsClose} />
      <HashtagSuggestions
        onSearchChange={this.handleHashtagSearch}
        suggestions={this.props.hashtagResults}
        onOpen={this.disableSubmitOnReturn}
        onClose={this.enableSubmitOnReturn} />
    </div>
  }
}
