import React, { Component, PropTypes } from 'react'
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
    placeholder: 'Begin typing...',
    selected: [],
    options: []
  }

  defaultState = () => {
    return {
      selected: [],
      suggestions: []
    }
  }

  constructor (props) {
    super(props)
    this.state = this.defaultState()
  }

  componentDidUpdate (prevProps) {
    if (this.props.selected.length > 0 && prevProps.selected.length < 1) {
      this.props.selected.forEach(community => this.handleAddition(community))
    }
  }

  reset = () => {
    this.setState(this.defaultState())
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
    const { placeholder, readOnly } = this.props
    const { selected, suggestions } = this.state

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
