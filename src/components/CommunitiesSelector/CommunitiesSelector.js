import React, { Component, PropTypes } from 'react'
import ReactTags from 'react-tag-autocomplete'
import styles from './CommunitiesSelector.scss'

export default class CommunitiesSelector extends Component {
  static propTypes = {
    communitySuggestions: PropTypes.object
  }

  constructor (props) {
    super(props)

    this.state = {
      communities: [
        { id: 1, name: 'Stop Kinder Morgan' },
        { id: 2, name: 'David Suzuki Foundation' }
      ],
      communitySuggestions: [
        { id: 3, name: 'Bananas' },
        { id: 4, name: 'Mangos' },
        { id: 5, name: 'Lemons' },
        { id: 6, name: 'Apricots' }
      ]
    }
  }

  handleDelete = () => {
    console.log('delete')
  }

  handleAddition = () => {
    console.log('addition')
  }

  render () {
    return (
      <ReactTags
        placeholder='Begin typing...'
        tags={this.state.communities}
        suggestions={this.state.communitySuggestions}
        handleDelete={this.handleDelete}
        handleAddition={this.handleAddition}
        classNames={styles}
      />
    )
  }
}
