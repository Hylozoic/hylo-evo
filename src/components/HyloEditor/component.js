import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createHashtagPlugin from './hashtagPlugin'
import { EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import 'draft-js/dist/Draft.css'
import 'draft-js-mention-plugin/lib/plugin.css'
// import 'draft-js-hashtag-plugin/lib/plugin.css'
import './component.scss'
// import './IssueEditor.scss'

const mentionPlugin = createMentionPlugin()
const hashtagPlugin = createHashtagPlugin()

const { MentionSuggestions } = mentionPlugin
// const { CompletionSuggestions } = hashtagPlugin
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
  }

  handleMentionsSearch = ({ value }) => {
    return this.props.findMentions(value)
  }

  handleHashtagSearch = ({ value }) => {
    // const searchValue = value.substring(1, value.length)
    // this.setState({
    //   hashtagResults: defaultSuggestionsFilter(searchValue, suggestions),
    // })
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
