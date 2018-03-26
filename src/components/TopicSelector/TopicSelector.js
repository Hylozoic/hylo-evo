import React, { Component } from 'react'
import TagInput from 'components/TagInput'
import styles from './TopicSelector.scss'
import { isEmpty, uniqBy, sortBy } from 'lodash/fp'
import { validateTopicName } from 'hylo-utils/validators'
import Icon from 'components/Icon'

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
    const sortedTopicResults = sortBy(['followersTotal', 'postsTotal'], topicResults).reverse()

    const suggestions = !validateTopicName(input)
      ? [{id: input, name: input, isNew: true}].concat(sortedTopicResults)
      : sortedTopicResults

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
        stripInputHashtag
        renderSuggestion={Suggestion}
      />
    )
  }
}

export function Suggestion (topic, handleChoice) {
  const {id, name, isNew, postsTotal, followersTotal} = topic
  const formatCount = count => isNaN(count)
    ? 0
    : count < 1000
      ? count
      : (count / 1000).toFixed(1) + 'k'

  return <li className={styles.item} key={id || 'blank'}>
    <a onClick={event => handleChoice(topic, event)}>
      <div>#{name}</div>
      {isNew
        ? <div styleName='suggestionMeta'>create new</div>
        : <div styleName='suggestionMeta'>
          <span styleName='column'><Icon name='Star' styleName='icon' />{formatCount(followersTotal)} subscribers</span>
          <span styleName='column'><Icon name='Events' styleName='icon' />{formatCount(postsTotal)} posts</span>
        </div>}
    </a>
  </li>
}
