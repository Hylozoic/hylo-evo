import PropTypes from 'prop-types'
import React, { Component } from 'react'
import TagInput from 'components/TagInput'
import styles from './TopicSelector.scss'
import { isEmpty } from 'lodash/fp'
import { validateTopicName } from 'hylo-utils/validators'

export default class TopicSelector extends Component {
  static propTypes = {
    placeholder: PropTypes.string,
    selected: PropTypes.array,
    options: PropTypes.array.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    placeholder: 'Type topic name...',
    selected: []
  }

  static defaultState = {
    selected: [],
    input: ''
  }

  constructor (props) {
    super(props)
    this.state = TopicSelector.defaultState
  }

  componentDidMount() {
    
  }

  getSelected = () => {
    return this.state.selected
  }

  reset = () => {
    this.setState(TopicSelector.defaultState)
  }

  handleInputChange = input => {
    this.setState({input})
    if (!isEmpty(input)) {
      this.props.findTopics(input)
    } else {
      this.props.clearTopics()
    }
  }

  handleAddition = topic => {
    this.setState({
      selected: this.state.selected.concat([topic])
    })
    this.props.clearTopics()
  }

  handleDelete = topic => {
    this.setState({
      selected: this.state.selected.filter(t => t.name !== topic.name)
    })
  }

  render () {
    const { placeholder, readOnly, topicResults } = this.props
    const { selected, input } = this.state

    const suggestions = !validateTopicName(input)
      ? [{id: -1, name: input}].concat(topicResults)
      : topicResults

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
