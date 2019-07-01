import React from 'react'
import { storiesOf } from '@storybook/react'
import TagInput from './TagInput'

class ExampleContainer extends React.Component {
  state = {
    tags: [
      { id: 'tag1', name: 'tag 1', avatarUrl: 'http://www.xat.com/web_gear/chat/av/41.png' },
      { id: 'tag2', label: 'tag 2', avatarUrl: 'https://www.xat.com/web_gear/chat/av/45.png' }
    ],
    suggestions: [
      { id: 1, name: 'suggestion 1', isError: true },
      { id: 2, name: 'suggestion 2', isError: false }
    ]
  }
  handleDelete = nodeToDelete => {
    this.setState({
      tags: this.state.tags.filter(node => node !== nodeToDelete)
    })
  }
  handleAddition = tag => {
    const tags = this.state.tags
    tags.push(tag)
    this.setState({
      tags
    })
  }
  handleInputChange = change => {
    // console.log(change)
  }
  render () {
    return <TagInput
      tags={this.state.tags}
      placeholder='Enter Tag'
      suggestions={this.state.suggestions}
      addLeadingHashtag
      allowNewTags
      handleDelete={this.handleDelete}
      handleAddition={this.handleAddition}
      handleInputChange={this.handleInputChange}
    />
  }
}

storiesOf('TagInput', module)
  .add('basic', () => <ExampleContainer />)
