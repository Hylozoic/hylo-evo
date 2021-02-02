import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { differenceBy } from 'lodash'
import TagInput from 'components/TagInput'
import styles from './GroupsSelector.scss'

export default class GroupsSelector extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    selected: PropTypes.array,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    placeholder: 'Type group name...',
    selected: [],
    options: []
  }

  static defaultState = {
    suggestions: []
  }

  constructor (props) {
    super(props)
    this.state = GroupsSelector.defaultState
  }

  reset = () => {
    this.setState(GroupsSelector.defaultState)
  }

  findSuggestions = (searchText) => {
    const { options, selected } = this.props
    let newSuggestions
    if (searchText && searchText.trim().length > 0) {
      newSuggestions = differenceBy(options, selected, 'id')
        .filter(o => o.name.match(new RegExp(searchText, 'i')))
      this.setState({ suggestions: newSuggestions })
    } else {
      newSuggestions = differenceBy(options, selected, 'id')
      this.setState({ suggestions: newSuggestions })
    }
  }

  clearSuggestions = () =>
    this.setState({ suggestions: GroupsSelector.defaultState.suggestions })

  handleInputChange = (input) => {
    if (input === null) {
      this.clearSuggestions()
    } else {
      this.findSuggestions(input)
    }
  }

  handleAddition = (groupOrGroups) => {
    const { onChange, selected } = this.props
    this.clearSuggestions()
    onChange(selected.concat(groupOrGroups))
  }

  handleDelete = (group) => {
    const { onChange, selected } = this.props
    onChange(selected.filter(c => c.id !== group.id))
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
        tagType='groups'
        theme={styles}
      />
    )
  }
}