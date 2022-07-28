import React, { Component } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import styles from './TopicSelector.scss'
import { isEmpty, uniqBy, sortBy } from 'lodash/fp'
import { Validators } from 'hylo-shared'
import Icon from 'components/Icon'

const MAX_TOPICS = 3
// const MAX_TOPIC_NAME_LENGTH = 10
// if (input.length > MAX_TOPIC_NAME_LENGTH) {
//   return
// }

const inputStyles = {
  container: styles => ({
    ...styles,
    cursor: 'text',
    fontFamily: 'Circular Book, sans-serif'
  }),
  valueContainer: styles => ({
    ...styles,
    padding: 0
  }),
  control: styles => ({
    ...styles,
    minWidth: '200px',
    border: 'none',
    boxShadow: 0,
    cursor: 'text'
  }),
  multiValue: styles => ({
    ...styles,
    backgroundColor: 'transparent'
  }),
  multiValueRemove: styles => ({ ...styles, cursor: 'pointer' }),
  clearIndicator: styles => ({ ...styles, cursor: 'pointer' }),
  placeholder: styles => ({ ...styles, color: 'rgb(192, 197, 205)' }),
  dropdownIndicator: styles => ({ display: 'none' }),
  indicatorSeparator: styles => ({ display: 'none' })
}

export default class TopicSelector extends Component {
  static defaultProps = {
    currentGroup: null,
    defaultTopics: [],
    detailsTopics: [],
    placeholder: 'Enter up to three topics...',
    selectedTopics: []
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
    if (prevProps.selectedTopics !== this.props.selectedTopics) {
      this.updateSelected()
    }
  }

  updateSelected () {
    if (this.state.topicsEdited) return

    const selected = uniqBy(
      t => t.name,
      this.state.selected.concat(this.props.selectedTopics)
    ).slice(0, 3)

    this.setState({ selected })
  }

  getSelected = () => {
    return this.state.selected
  }

  reset = () => {
    this.setState(TopicSelector.defaultState)
  }

  handleInputChange = async (input) => {
    if (input.charAt(0) === '#') {
      input = input.slice(1)
    }

    this.setState({ input })

    if (!isEmpty(input)) {
      const topicResults2 = await this.props.findTopics(input)
      const { currentGroup, defaultTopics, topicResults } = this.props
      const sortedTopics = sortBy([t => t.name === input ? -1 : 1, 'followersTotal', 'postsTotal'], topicResults)
      console.log('!!! topicResults', topicResults2)

      return defaultTopics
        ? [
          {
            label: currentGroup ? currentGroup.name : 'Default' + ' Topics',
            options: defaultTopics
          }, {
            label: 'All Topics',
            options: sortedTopics
          }
        ] : sortedTopics
    } else {
      this.props.clearTopics()
      return []
    }
  }

  handleTopicsChange = newTopics => {
    const topics = newTopics.filter(t => !Validators.validateTopicName(t.name))

    if (topics.length <= MAX_TOPICS) {
      this.setState({
        selected: topics || [],
        topicsEdited: true
      })
    }
    this.props.clearTopics()
    this.props.onChange && this.props.onChange(topics)
  }

  render () {
    const { currentGroup, defaultTopics, placeholder } = this.props
    const { selected } = this.state

    // If at max # topics don't show more default topics to select
    const defaultsToShow = selected.length >= MAX_TOPICS
      ? []
      : defaultTopics
        ? [
          {
            label: currentGroup ? currentGroup.name : 'Default' + ' Topics',
            options: defaultTopics
          }
        ] : []

    return (
      <AsyncCreatableSelect
        placeholder={placeholder}
        isMulti
        name='topics'
        value={selected}
        classNamePrefix='topic-selector'
        defaultOptions={defaultsToShow}
        styles={inputStyles}
        loadOptions={this.handleInputChange}
        onChange={this.handleTopicsChange}
        getNewOptionData={(inputValue, optionLabel) => {
          const sanitizedValue = inputValue.charAt(0) === '#' ? inputValue.slice(1) : inputValue

          return selected.length < MAX_TOPICS
            ? {
              name: sanitizedValue,
              value: sanitizedValue,
              __isNew__: true
            } : null
        }}
        noOptionsMessage={() => {
          return selected.length >= MAX_TOPICS ? 'You can only select up to 3 topics' : 'Start typing to add a topic'
        }}
        formatOptionLabel={(item, { context }) => {
          if (item.name === '') {
            return <span>Start typing to add a topic</span>
          }
          if (context === 'value') {
            return <div styleName='topicLabel'>#{item.name}</div>
          }
          if (item.__isNew__) {
            return <div>Create topic &quot;#{item.value}&quot;</div>
          }

          const { name, postsTotal, followersTotal } = item
          const formatCount = count => isNaN(count)
            ? 0
            : count < 1000
              ? count
              : (count / 1000).toFixed(1) + 'k'

          return (
            <div className={styles.item}>
              <div styleName='menuTopicLabel'>#{name}</div>
              <div styleName='suggestionMeta'>
                <span styleName='column'><Icon name='Star' styleName='icon' />{formatCount(followersTotal)} subscribers</span>
                <span styleName='column'><Icon name='Events' styleName='icon' />{formatCount(postsTotal)} posts</span>
              </div>
            </div>
          )
        }}
      />
    )
  }
}
