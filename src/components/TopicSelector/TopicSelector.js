import React, { Component } from 'react'
import TagInput from 'components/TagInput'
import styles from './TopicSelector.scss'
import { isEmpty, uniqBy } from 'lodash/fp'
import { validateTopicName } from 'hylo-utils/validators'

export default class TopicSelector extends Component {
  static defaultProps = {
    placeholder: 'Type topic name...',
    selectedTopics: [],
    detailsTopics: []
  }

  static defaultState = {
    selected: [],
    input: '',
    topicsEdited: false
  }

  constructor (props) {
    super(props)
    this.state = TopicSelector.defaultState
  }

  componentDidMount () {
    this.updateSelected()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.selectedTopics !== this.props.selectedTopics ||
      prevProps.detailsTopics !== this.props.detailsTopics) {
      this.updateSelected()
    }
  }

  updateSelected () {
    if (!this.state.topicsEdited) {
      const selected = uniqBy(t => t.name,
        this.state.selected.concat(this.props.selectedTopics.concat(this.props.detailsTopics))).slice(0, 3)
      this.setState({
        selected
      })
    }
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
      selected: this.state.selected.filter(t => t.name !== topic.name),
      topicsEdited: true
    })
  }

  render () {
    const { placeholder, readOnly, topicResults } = this.props
    const { selected, input } = this.state
    const suggestions = !validateTopicName(input)
      ? [{id: input, name: input}].concat(topicResults)
      : topicResults

    return (
      <TagInput
        placeholder={placeholder}
        tags={selected}
        suggestions={isEmpty(input) ? [] : suggestions}
        handleInputChange={this.handleInputChange}
        handleAddition={this.handleAddition}
        handleDelete={this.handleDelete}
        readOnly={readOnly}
        theme={styles}
        maxTags={3}
        addLeadingHashtag
      />
    )
  }
}
