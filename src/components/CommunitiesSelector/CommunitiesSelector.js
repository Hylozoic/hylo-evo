import React, { Component, PropTypes } from 'react'
import { differenceBy } from 'lodash'
import TagInput from 'components/TagInput'
import styles from './CommunitiesSelector.scss'

export default class CommunitiesSelector extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    options: []
  }

  constructor (props) {
    super(props)
    this.state = {
      selected: [],
      suggestions: []
    }
  }

  findSuggestions = (searchText) => {
    const { options } = this.props
    const { selected } = this.state
    const newSuggestions = differenceBy(options, selected, 'id')
      .filter(o => o.name.match(new RegExp(searchText)))
    this.setState({ suggestions: newSuggestions })
  }

  clearSuggestions = () =>
    this.setState({suggestions: []})

  handleInputChange = (input) => {
    if (input && input.length > 0) {
      this.findSuggestions(input)
    } else {
      this.clearSuggestions()
    }
  }

  handleDelete = (community) => {
    const { onChange } = this.props
    let selected = this.state.selected.filter(c => c.id !== community.id)
    this.setState({ selected })
    onChange(selected)
  }

  handleAddition = (community) => {
    const { onChange } = this.props
    let selected = this.state.selected.concat(community)
    this.setState({ selected })
    this.clearSuggestions()
    onChange(selected)
  }

  render () {
    const { selected, suggestions } = this.state

    return (
      <TagInput
        placeholder='Begin typing...'
        tags={selected}
        suggestions={suggestions}
        handleInputChange={this.handleInputChange}
        handleAddition={this.handleAddition}
        handleDelete={this.handleDelete}
        theme={styles}
      />
    )
  }
}
