import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import AsyncCreatableSelect from 'react-select/async-creatable'
import styles from './TopicSelector.scss'
import { isEmpty, sortBy } from 'lodash/fp'
import { Validators } from 'hylo-shared'
import Icon from 'components/Icon'
import connector from './TopicSelector.connector'

const inputStyles = {
  container: styles => ({
    ...styles,
    cursor: 'text',
    fontFamily: 'Circular Book, sans-serif'
  }),
  control: styles => ({
    ...styles,
    minWidth: '200px',
    border: 'none',
    boxShadow: 0,
    cursor: 'text'
  }),
  multiValue: styles => ({ ...styles, backgroundColor: 'transparent' }),
  multiValueRemove: styles => ({ ...styles, cursor: 'pointer' }),
  clearIndicator: styles => ({ ...styles, cursor: 'pointer' }),
  dropdownIndicator: styles => ({ display: 'none' }),
  indicatorSeparator: styles => ({ display: 'none' }),
  placeholder: styles => ({ ...styles, color: 'rgb(192, 197, 205)' })
}

class SingleTopicSelector extends Component {
  static defaultProps = {
    currentGroup: null,
    defaultTopics: []
  }

  static defaultState = {
    value: null
  }

  constructor (props) {
    super(props)
    this.state = SingleTopicSelector.defaultState
  }

  handleInputChange = async (value) => {
    this.setState({ value })
    if (!isEmpty(value)) {
      await this.props.findTopics({ autocomplete: value })
      const { currentGroup, defaultTopics, topicResults } = this.props
      const sortedTopics = sortBy([t => t.name === value ? -1 : 1, 'followersTotal', 'postsTotal'], topicResults)
      return defaultTopics ? [ { label: currentGroup.name + ' topics', options: defaultTopics }, { label: 'All Topics', options: sortedTopics } ] : sortedTopics
    } else {
      this.setState({ value: null })
      return []
    }
  }

  handleSelectTopic = newTopic => {
    const topic = Validators.validateTopicName(newTopic) ? newTopic : ''

    if (this.props.onSelectTopic) {
      this.props.onSelectTopic(topic)
      this.setState({ value: null })
      return
    }
    this.setState({
      value: topic
    })
  }

  render () {
    const { currentGroup, defaultTopics, placeholder = this.props.t('Find/add a topic') } = this.props
    const { value } = this.state

    const defaultsToShow = defaultTopics ? [ { label: ('{{currentGroup.name}} topics', { currentGroup }), options: defaultTopics } ] : []

    return (
      <AsyncCreatableSelect
        placeholder={placeholder}
        name='topic-selector'
        value={value}
        isClearable
        classNamePrefix='topic-selector'
        defaultOptions={defaultsToShow}
        styles={inputStyles}
        loadOptions={this.handleInputChange}
        onChange={this.handleSelectTopic}
        getNewOptionData={(inputValue, optionLabel) => ({ name: inputValue, label: inputValue, value: inputValue, __isNew__: true })}
        noOptionsMessage={() => {
          return this.props.t('Start typing to find/create a topic to add')
        }}
        isOptionDisabled={option => option.__isNew__ && option.value.length < 3}
        formatOptionLabel={(item, { context, inputValue, selectValue }) => {
          if (context === 'value') {
            return <div styleName='topicLabel'>#{item.label}</div>
          }
          if (item.__isNew__) {
            return <div>{item.value.length < 3 ? this.props.t('Topics must be longer than 2 characters') : this.props.t('Create topic "{{item.value}}"', { item })}</div>
          }
          const { name, postsTotal, followersTotal } = item
          const formatCount = count => isNaN(count)
            ? 0
            : count < 1000
              ? count
              : (count / 1000).toFixed(1) + 'k'

          return <div className={styles.item}>
            <div styleName='menuTopicLabel'>#{name}</div>
            <div styleName='suggestionMeta'>
              <span styleName='column'><Icon name='Star' styleName='icon' />{formatCount(followersTotal)} {this.props.t('subscribers')}</span>
              <span styleName='column'><Icon name='Events' styleName='icon' />{formatCount(postsTotal)} {this.props.t('posts')}</span>
            </div>
          </div>
        }}
      />
    )
  }
}

export default withTranslation()(connector(SingleTopicSelector))
