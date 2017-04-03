import React from 'react'
import { EditorState } from 'draft-js'
import Editor from 'draft-js-plugins-editor'
import { List, fromJS } from 'immutable'

import createHashtagPlugin, { defaultSuggestionsFilter } from '../hashtagPlugin'
import './HashtagEditor.scss'

const hashtagPlugin = createHashtagPlugin()
const { CompletionSuggestions } = hashtagPlugin
const plugins = [hashtagPlugin]

const suggestions = fromJS([
  {
    id: 1,
    subject: 'New Cool Feature'
  },
  {
    id: 2,
    subject: 'Bug'
  },
  {
    id: 3,
    subject: 'Improve Documentation'
  }
])

export default class HashtagEditor extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      editorState: EditorState.createEmpty(),
      suggestions: List()
    }
  }

  onChange = (editorState, cb) => this.setState({ editorState }, cb)

  onHashtagSearchChange = ({ value }) => {
    const searchValue = value.substring(1, value.length)
    this.setState({
      suggestions: defaultSuggestionsFilter(searchValue, suggestions)
    })
  }

  focus = () => this.refs.editor.focus()

  render () {
    return (
      <div>
        <div className='editor' onClick={this.focus} >
          <Editor
            editorState={this.state.editorState}
            onChange={this.onChange}
            plugins={plugins}
            spellCheck
            stripPastedStyles
            placeholder='Enter some text, with a # to see the hashtag autocompletion'
            ref='editor'
          />
        </div>
        <CompletionSuggestions
          onSearchChange={this.onHashtagSearchChange}
          suggestions={this.state.suggestions}
        />
      </div>
    )
  }
}
