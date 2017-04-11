import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createHashtagPlugin from './hashtagPlugin'
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

const { MentionSuggestions } = mentionPlugin
const { CompletionSuggestions: HashtagSuggestions } = hashtagPlugin

const plugins = [
  mentionPlugin,
  hashtagPlugin
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
    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  handleEditorChange = (editorState) => {
    if (this.props.debug) console.log(stateToHTML(editorState.getCurrentContent()))
    this.setState({ editorState })
    this.props.onChange(stateToHTML(editorState.getCurrentContent()))
  }

  handleMentionsSearch = ({ value }) => {
    return this.props.findMentions(value)
  }

  handleHashtagSearch = ({ value }) => {
    return this.props.findHashtags(value)
  }

  render () {
    return <div styleName='wrapper' className={this.props.className}>
      <Editor
        editorState={this.state.editorState}
        onChange={this.handleEditorChange}
        placeholder={this.props.placeholder}
        plugins={plugins} />
      <MentionSuggestions
        onSearchChange={this.handleMentionsSearch}
        suggestions={this.props.mentionResults}
        onClose={this.props.clearMentions} />
      <HashtagSuggestions
        onSearchChange={this.handleHashtagSearch}
        suggestions={this.props.hashtagResults} />
    </div>
  }
}
