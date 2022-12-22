import cx from 'classnames'
import { find } from 'lodash/fp'
import { arrayOf, func, number, shape, string, object, bool } from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import CreateTopic from 'components/CreateTopic'
// import { GroupCell } from 'components/GroupsList/GroupsList'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import SingleTopicSelector from 'components/TopicSelector/SingleTopicSelector'
import ScrollListener from 'components/ScrollListener'
import TextInput from 'components/TextInput'
import { TOPIC_VISIBILITY } from 'store/models/Topic'
import { inflectedTotal } from 'util/index'
import styles from './TopicsSettingsTab.scss'

const sortOptions = [
  { id: 'name', label: 'Name' },
  { id: 'followersTotal', label: 'Popular' }
]

const visibilityOptions = Object.keys(TOPIC_VISIBILITY).reduce((result, option) => result.concat({ value: option, label: TOPIC_VISIBILITY[option] }), [])

const TOPIC_LIST_ID = 'topic-list'

const topicType = shape({
  id: string,
  name: string.isRequired,
  postsTotal: number,
  followersTotal: number,
  isSubscribed: bool
})

class TopicsSettingsTab extends Component {
  state = {
    createTopicModalVisible: false
  }

  static propTypes = {
    group: object.isRequired,
    defaultTopics: arrayOf(topicType),
    topics: arrayOf(topicType),
    selectedSort: string,
    setSort: func,
    search: string,
    setSearch: func,
    setGroupTopicVisibility: func.isRequired,
    totalTopics: number
  }

  updateCachedTopicsState (state, props) {
    return { totalTopicsCached: props.totalTopics }
  }

  componentDidMount () {
    this.props.fetchTopics()
    this.props.fetchDefaultTopics()

    // Caching totalTopics because the total returned in the queryset
    // changes when there is a search term
    this.setState(this.updateCachedTopicsState)
  }

  componentDidUpdate (prevProps) {
    if (!this.state.totalTopicsCached && !prevProps.totalTopics && this.props.totalTopics) {
      this.setState(this.updateCachedTopicsState)
    }
    if (prevProps.fetchTopicsParams.groupSlug !== this.props.fetchTopicsParams.groupSlug) {
      this.props.fetchTopics()
      this.props.fetchDefaultTopics()
    } else if (prevProps.selectedSort !== this.props.selectedSort || prevProps.search !== this.props.search) {
      this.props.fetchTopics()
    }
  }

  setGroupTopicVisibility = (groupTopicId, value) => (e) => {
    e.preventDefault()
    this.props.setGroupTopicVisibility(groupTopicId, value)
  }

  removeSuggestedTopic = (groupTopicId) => (e) => {
    e.preventDefault()
    this.props.setGroupTopicIsDefault(groupTopicId, false)
  }

  toggleTopicModal = () =>
    this.setState({
      createTopicModalVisible: !this.state.createTopicModalVisible
    })

  render () {
    const {
      group,
      defaultTopics,
      topics,
      search,
      setSearch,
      selectedSort,
      setSort,
      fetchMoreTopics,
      fetchIsPending,
      t
    } = this.props
    const { totalTopicsCached } = this.state

    return (<div styleName='wrapper'>
      <div styleName='default-topics'>
        <div styleName='title'>{this.props.t('Group Suggested Topics')}</div>
        <p>
          {this.props.t(`Set default topics for your group which will be suggested first when
          members are creating a new post.
          Every new member will also be subscribed to these topics when they join.`)}
        </p>
        <div styleName='default-topic-list'>
          {defaultTopics.map(topic =>
            <TopicListItem
              key={topic.id}
              singleGroup={group}
              topic={topic}
              setGroupTopicVisibility={this.setGroupTopicVisibility}
              removeSuggestedTopic={this.removeSuggestedTopic}
              isSuggested
            />
          )}
          <div styleName='default-topic-selector'>
            <SingleTopicSelector
              currentGroup={group}
              placeholder={this.props.t('Add a suggested topic')}
              onSelectTopic={(topic) => {
                topic && this.props.createTopic(topic.name, group.id, true, false)
              }}
            />
          </div>
        </div>
      </div>
      <div styleName='all-topics'>
        <div styleName='title'>{this.props.t('Topic List Editor')}</div>
        <p>
          {this.props.t(`Below is a list of every topic that any member of your group has used to date. You can choose to hide
          topics that you would prefer members of your group don't use, or pin topics to the top of the list
          to make sure people pay attention to posts in those topics.`)}
        </p>
        <div styleName='controls'>
          <SearchBar {...{ search, setSearch, selectedSort, setSort, fetchIsPending, totalTopicsCached }} />
          <CreateTopic
            buttonText={this.props.t('Add a Topic')}
            groupId={group.id}
            groupSlug={group.slug}
            topics={topics} />
        </div>
        <div styleName='topic-list' id={TOPIC_LIST_ID}>
          {topics.map(topic =>
            <TopicListItem
              key={topic.id}
              singleGroup={group}
              topic={topic}
              canModerate
              setGroupTopicVisibility={this.setGroupTopicVisibility}
            />
          )}
          <ScrollListener onBottom={() => fetchMoreTopics()} elementId={TOPIC_LIST_ID} />
        </div>
      </div>
    </div>)
  }
}

export function SearchBar ({ search, setSearch, selectedSort, setSort, fetchIsPending, totalTopicsCached }) {
  const { t } = useTranslation()
  let selected = find(o => o.id === selectedSort, sortOptions)

  if (!selected) selected = sortOptions[0]

  return <div styleName='search-bar'>
    <TextInput styleName='search-input'
      value={search}
      placeholder={this.props.t(`Search {{count}} topics`, { count: totalTopicsCached || '' })}
      loading={fetchIsPending}
      noClearButton
      onChange={event => setSearch(event.target.value)} />
    <Dropdown styleName='search-order'
      toggleChildren={<span styleName='search-sorter-label'>
        {selected.label}
        <Icon name='ArrowDown' />
      </span>}
      items={sortOptions.map(({ id, label }) => ({
        label,
        onClick: () => setSort(id)
      }))}
      alignRight />
  </div>
}

export function TopicListItem ({ topic, singleGroup, setGroupTopicVisibility, removeSuggestedTopic, isSuggested }) {
  const { name, groupTopics, postsTotal, followersTotal } = topic

  const groupTopic = groupTopics.find(ct => ct.group.id === singleGroup.id)

  return (
    <div styleName='topic'>
      <div styleName='topic-name'>#{name}</div>
      {singleGroup &&
        <div styleName='topic-stats'>{inflectedTotal('post', postsTotal)} • {inflectedTotal('subscriber', followersTotal)}</div>}
      {singleGroup && !isSuggested && (
        <Dropdown
          alignRight
          styleName='visibility-dropdown'
          toggleChildren={<span styleName={cx('visibility-dropdown-label', 'visibilityDropdown' + TOPIC_VISIBILITY[groupTopic.visibility])}>
            <Icon name='Eye' />
            <span styleName='label-content'>{TOPIC_VISIBILITY[groupTopic.visibility]}</span>
            <Icon name='ArrowDown' />
          </span>}
          items={visibilityOptions.map(({ value, label }) => ({
            label,
            onClick: setGroupTopicVisibility(groupTopic.id, value),
            styleName: styles['visibilityDropdown' + label]
          }))}
        />
      )}
      {singleGroup && isSuggested && (
        <Icon name='Trash' onClick={removeSuggestedTopic(groupTopic.id)} styleName='remove-suggested-topic-button' />
      )}
    </div>
  )
}

export default withTranslation()(TopicsSettingsTab)
