import React, { Component } from 'react'
import Editor from 'draft-js-plugins-editor'
import createMentionPlugin from 'draft-js-mention-plugin'
import createHashtagPlugin from 'draft-js-hashtag-plugin'
import { EditorState } from 'draft-js'
import 'draft-js-mention-plugin/lib/plugin.css'
import 'draft-js-hashtag-plugin/lib/plugin.css'

// Creates an Instance. At this step, a configuration object can be passed in
// as an argument.
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
    return <div styleName='editor'>
      <h2>Hylo Editor</h2>
      <Editor
        editorState={editorState}
        placeholder='Enter your request'
        onChange={this.onChange}
        plugins={plugins}
      />
      <MentionSuggestions
        onSearchChange={this.onSearchChange}
        suggestions={mentionResults}
      />
    </div>
  }
}
