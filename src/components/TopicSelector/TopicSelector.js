import React, { Component } from 'react'
import AsyncCreatableSelect from 'react-select/async-creatable'
import styles from './TopicSelector.scss'
import { isEmpty, isEqual, uniqBy, sortBy, get, includes } from 'lodash/fp'
import { Validators } from 'hylo-shared'
import Icon from 'components/Icon'

/*

`TopicSelector`

  * Don't be mislead by `forGroups`, only the first in that array will be used.
    The implemenation here is mostly ready to handle fetching and presenting
    default topics for multiple groups (i.e. when a Post is posted to multiple
    groups), but the backend endpoint to `fetchDefaultTopics` needs to be
    updated to allow the query of multiple groups. Alternatively separately fetch
    for each group in the list, but deciding against that for now.

  * TODO: Topic name selection should be confined some `MAX_TOPIC_NAME_LENGTH`

*/

const MAX_TOPICS = 3
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
    forGroups: [],
    defaultTopics: [],
    placeholder: 'Enter up to three topics...',
    selectedTopics: []
  }

  static defaultState = {
    selected: [],
    topicsEdited: false
  }

  constructor (props) {
    super(props)
    this.state = TopicSelector.defaultState
  }

  componentDidMount () {
    this.updateSelected()
    this.props.fetchDefaultTopics({ groupSlug: get('forGroups[0].slug', this.props) })
  }

  componentDidUpdate (prevProps) {
    if (prevProps.selectedTopics !== this.props.selectedTopics) {
      this.updateSelected()
    }

    if (!isEqual(this.props.forGroups, prevProps.forGroups)) {
      this.props.fetchDefaultTopics({ groupSlug: get('forGroups[0].slug', this.props) })
    }
  }

  updateSelected () {
    if (this.state.topicsEdited) return

    const selected = uniqBy(
      t => t.name,
      this.state.selected.concat(this.props.selectedTopics)
    ).slice(0, MAX_TOPICS)

    this.setState({ selected })
  }

  getSelected = () => {
    return this.state.selected
  }

  reset = () => {
    this.setState(TopicSelector.defaultState)
  }

  formatGroupTopicSuggestions = groupTopics => {
    if (!groupTopics) return

    const { forGroups } = this.props
    const { selected } = this.state

    // Note: `forGroups` handling is staged here for a backend change which will allow
    //        return of multiple default group topics...
    return groupTopics.length > 0 && selected.length < MAX_TOPICS && (
      [{
        label: forGroups && forGroups.length > 0
          ? forGroups[0].name
          : 'Default Topics',
        options: groupTopics
      }]
    )
  }

  findTopicSuggestions = async (input) => {
    // if (this.state.selected.length >= MAX_TOPICS) return []

    const { findTopics, defaultTopics } = this.props
    const response = await findTopics({ autocomplete: input })
    const topicResults = response.payload.getData().items.map(get('topic'))
    const sortedTopicResults = sortBy(
      [t => t.name === input ? -1 : 1, 'followersTotal', 'postsTotal'],
      topicResults
    )
    const filteredDefaultTopics = defaultTopics.filter(topic => {
      return includes(
        input,
        topic.name && topic.name.toLowerCase()
      )
    })

    return [
      ...this.formatGroupTopicSuggestions(filteredDefaultTopics) || [],
      {
        label: 'All Topics',
        options: sortedTopicResults
      }
    ]
  }

  loadOptions = async (input) => {
    if (this.state.selected.length >= MAX_TOPICS || isEmpty(input)) return []

    if (input.charAt(0) === '#') {
      input = input.slice(1)
    }

    return this.findTopicSuggestions(input)
  }

  handleTopicsChange = newTopics => {
    const topics = newTopics.filter(t => !Validators.validateTopicName(t.name))

    if (topics.length <= MAX_TOPICS) {
      this.setState({
        selected: topics || [],
        topicsEdited: true
      })
    }

    this.props.onChange && this.props.onChange(topics)
  }

  render () {
    const { placeholder, defaultTopics: providedDefaultTopics } = this.props
    const { selected } = this.state
    const defaultTopics = this.formatGroupTopicSuggestions(providedDefaultTopics) || []

    return (
      <AsyncCreatableSelect
        placeholder={placeholder}
        isMulti
        name='topics'
        value={selected}
        classNamePrefix='topic-selector'
        defaultOptions={defaultTopics}
        styles={inputStyles}
        loadOptions={this.loadOptions}
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
          return selected.length >= MAX_TOPICS ? `You can only select up to ${MAX_TOPICS} topics` : 'Start typing to add a topic'
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
