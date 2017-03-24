import React, { Component } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js'

export default class HyloEditor extends Component {
  constructor (props) {
    super(props)
    this.state = {editorState: EditorState.createEmpty()}
    this.onChange = (editorState) => this.setState({editorState})
  }

  _onBoldClick () {
    this.onChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'))
  }

  render () {
    const { editorState } = this.state
    return (
      <div>
        <h2>Hylo Editor</h2>
        <button onClick={this._onBoldClick.bind(this)}>Bold</button>
        <Editor editorState={editorState} placeholder='Enter your request' onChange={this.onChange} />
      </div>
    )
  }
}
