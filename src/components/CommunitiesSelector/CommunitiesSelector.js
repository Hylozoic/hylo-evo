import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { differenceBy } from 'lodash'
import TagInput from 'components/TagInput'
import styles from './CommunitiesSelector.scss'

export default class CommunitiesSelector extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    selected: PropTypes.array,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    placeholder: 'Type community name...',
    selected: [],
    options: []
  }

  static defaultState = {
    suggestions: []
  }

  constructor (props) {
    super(props)
    this.state = CommunitiesSelector.defaultState
  }

  reset = () => {
    this.setState(CommunitiesSelector.defaultState)
  }

  findSuggestions = (searchText) => {
    const { options, selected } = this.props
    const newSuggestions = differenceBy(options, selected, 'id')
      .filter(o => o.name.match(new RegExp(searchText, 'i')))
    this.setState({ suggestions: newSuggestions })
  }

  clearSuggestions = () =>
    this.setState({suggestions: CommunitiesSelector.defaultState.suggestions})

  handleInputChange = (input) => {
    if (input && input.length > 0) {
      this.findSuggestions(input)
    } else {
      this.clearSuggestions()
    }
  }

  handleAddition = (communityOrCommunities) => {
    const { onChange, selected } = this.props
    this.clearSuggestions()
    onChange(selected.concat(communityOrCommunities))
  }

  handleDelete = (community) => {
    const { onChange, selected } = this.props
    onChange(selected.filter(c => c.id !== community.id))
  }

  render () {
    const { selected, placeholder, readOnly } = this.props
    const { suggestions } = this.state

    return (
      <TagInput
        placeholder={placeholder}
        tags={selected}
        suggestions={suggestions}
        handleInputChange={this.handleInputChange}
        handleAddition={this.handleAddition}
        handleDelete={this.handleDelete}
        readOnly={readOnly}
        theme={styles}
      />
    )
  }
}
