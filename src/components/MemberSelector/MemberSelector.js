import React, { Component } from 'react'
import TagInput from 'components/TagInput'
import styles from './MemberSelector.scss'
import { isEmpty } from 'lodash/fp'

export default class MemberSelector extends Component {
  static defaultProps = {
    placeholder: 'Type persons name...'
  }

  componentDidMount () {
  }

  componentDidUpdate (prevProps) {
  }

  handleInputChange = input => {
    this.props.setAutocomplete(input)
    if (!isEmpty(input)) {
      // this fetched should be debounced or throttled, maybe here, or in the connector
      this.props.fetchPeople(input)
    } else {
      this.props.clearPeople()
    }
  }

  handleAddition = person => {
    this.setState({
      selected: this.state.selected.concat([person])
    })
    this.props.clearPeople()
  }

  handleDelete = person => {
    this.setState({
      selected: this.state.selected.filter(p => p.id !== person.id)
    })
  }

  render () {
    const { placeholder, readOnly, people, autocomplete, members = [] } = this.props

    console.log('render, propel', people)

    return (
      <TagInput
        placeholder={placeholder}
        tags={members}
        suggestions={isEmpty(autocomplete) ? [] : people}
        handleInputChange={this.handleInputChange}
        handleAddition={this.handleAddition}
        handleDelete={this.handleDelete}
        readOnly={readOnly}
        theme={styles}
        maxTags={3}
        addLeadingHashtag
        stripInputHashtag
        renderSuggestion={Suggestion}
      />
    )
  }
}

export function Suggestion ({item, handleChoice}) {
  const { id, name } = item
  return <li className={styles.item} key={id || 'blank'}>
    <a onClick={event => handleChoice(item, event)}>
      <div>{name}</div>
    </a>
  </li>
}
