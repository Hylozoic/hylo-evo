import React, { Component } from 'react'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import { EditorState } from 'draft-js'
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
  constructor (props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty()
    }
  }

  onChange = (editorState) =>
    this.setState({editorState})

  onSearchChange = ({ value }) => {
    console.log(value)
    return this.props.findMentions(value)
  }

  render () {
    const { editorState } = this.state
    const { mentionResults } = this.props
    const placeholder = "Hi Axolotl, what's on your mind?"

    return <div styleName='editor'>
      <Editor
        editorState={editorState}
        placeholder={placeholder}
        onChange={this.onChange}
        plugins={plugins} />
      <MentionSuggestions
        onSearchChange={this.onSearchChange}
        suggestions={mentionResults} />
    </div>
  }
}
