import React, { Component, PropTypes } from 'react'
import Immutable from 'immutable'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import { EditorState } from 'draft-js'
import { stateToHTML } from 'draft-js-export-html'
import 'draft-js/dist/Draft.css'
import 'draft-js-mention-plugin/lib/plugin.css'
import 'draft-js-hashtag-plugin/lib/plugin.css'
import './component.scss'

const hashtagPlugin = createHashtagPlugin()
const mentionPlugin = createMentionPlugin()

const { MentionSuggestions } = mentionPlugin

const plugins = [
  mentionPlugin,
  hashtagPlugin
]

export default class HyloEditor extends Component {
  static propTypes = {
    mentionResults: PropTypes.instanceOf(Immutable.List),
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

  handleEditorStateUpdate = (editorState) => {
    // if (this.props.debug) console.log(stateToHTML(editorState))
    this.setState({ editorState })
  }

  handleMentionsSearch = ({ value }) => {
    console.log('!!!', value)
    return this.props.findMentions(value)
  }

  render () {
    return <div styleName='wrapper' className={this.props.className}>
      <Editor
        editorState={this.state.editorState}
        onChange={this.handleEditorStateUpdate}
        placeholder={this.props.placeholder}
        plugins={plugins} />
      <MentionSuggestions
        onSearchChange={this.handleMentionsSearch}
        suggestions={this.props.mentionResults}
        onClose={this.props.clearMentions} />
    </div>
  }
}
