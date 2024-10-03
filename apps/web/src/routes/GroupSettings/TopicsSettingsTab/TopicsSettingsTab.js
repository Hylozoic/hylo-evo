import cx from 'classnames'
import { find } from 'lodash/fp'
import { arrayOf, func, number, shape, string, object, bool } from 'prop-types'
import React, { Component } from 'react'
import { withTranslation, useTranslation } from 'react-i18next'
import CreateTopic from 'components/CreateTopic'
// import { GroupCell } from 'components/GroupsList/GroupsList'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import SingleTopicSelector from 'components/TopicSelector/SingleTopicSelector'
import ScrollListener from 'components/ScrollListener'
import TextInput from 'components/TextInput'
import { TOPIC_VISIBILITY } from 'store/models/Topic'
import { inflectedTotal } from 'util/index'
import styles from './TopicsSettingsTab.module.scss'

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

    return (
      <div className={styles.wrapper}>
        <div className={styles.defaultTopics}>
          <div className={styles.title}>{t('Group Suggested Topics')}</div>
          <p>
            {t(`Set default topics for your group which will be suggested first when
            members are creating a new post.
            Every new member will also be subscribed to these topics when they join.`)}
          </p>
          <div className={styles.defaultTopicList}>
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
            <div className={styles.defaultTopicSelector}>
              <SingleTopicSelector
                currentGroup={group}
                placeholder={t('Add a suggested topic')}
                onSelectTopic={(topic) => {
                  topic && this.props.createTopic(topic.name, group.id, true, false)
                }}
              />
            </div>
          </div>
        </div>
        <div className={styles.allTopics}>
          <div className={styles.title}>{t('Topic List Editor')}</div>
          <p>
            {t(`Below is a list of every topic that any member of your group has used to date. You can choose to hide
            topics that you would prefer members of your group don't use, or pin topics to the top of the list
            to make sure people pay attention to posts in those topics.`)}
          </p>
          <div className={styles.controls}>
            <SearchBar {...{ search, setSearch, selectedSort, setSort, fetchIsPending, totalTopicsCached }} />
            <CreateTopic
              buttonText={t('Add a Topic')}
              groupId={group.id}
              groupSlug={group.slug}
              topics={topics} />
          </div>
          <div className={styles.topicList} id={TOPIC_LIST_ID}>
            {topics.map(topic =>
              <TopicListItem
                key={topic.id}
                singleGroup={group}
                topic={topic}
                setGroupTopicVisibility={this.setGroupTopicVisibility}
              />
            )}
            <ScrollListener onBottom={() => fetchMoreTopics()} elementId={TOPIC_LIST_ID} />
          </div>
        </div>
      </div>
    )
  }
}

export function SearchBar ({ search, setSearch, selectedSort, setSort, fetchIsPending, totalTopicsCached }) {
  const { t } = useTranslation()
  let selected = find(o => o.id === selectedSort, sortOptions)

  if (!selected) selected = sortOptions[0]

  return (
    <div className={styles.searchBar}>
      <TextInput
        className={styles.searchInput}
        value={search}
        placeholder={t('Search {{count}} topics', { count: totalTopicsCached || '' })}
        loading={fetchIsPending}
        noClearButton
        onChange={event => setSearch(event.target.value)} />
      <Dropdown
        className={styles.searchOrder}
        toggleChildren={<span className={styles.searchSorterLabel}>
          {t(selected.label)}
          <Icon name='ArrowDown' />
        </span>}
        items={sortOptions.map(({ id, label }) => ({
          label: t(label),
          onClick: () => setSort(id)
        }))}
        alignRight />
    </div>
  )
}

export function TopicListItem ({ topic, singleGroup, setGroupTopicVisibility, removeSuggestedTopic, isSuggested }) {
  const { name, groupTopics, postsTotal, followersTotal } = topic

  const groupTopic = groupTopics.find(ct => ct.group.id === singleGroup.id)

  return (
    <div className={styles.topic}>
      <div className={styles.topicName}>#{name}</div>
      {singleGroup &&
        <div className={styles.topicStats}>{inflectedTotal('post', postsTotal)} • {inflectedTotal('subscriber', followersTotal)}</div>}
      {singleGroup && !isSuggested && (
        <Dropdown
          alignRight
          className={styles.visibilityDropdown}
          toggleChildren={<span className={cx(styles.visibilityDropdownLabel, styles[`visibilityDropdown${TOPIC_VISIBILITY[groupTopic.visibility]}`])}>
            <Icon name='Eye' />
            <span className={styles.labelContent}>{TOPIC_VISIBILITY[groupTopic.visibility]}</span>
            <Icon name='ArrowDown' />
          </span>}
          items={visibilityOptions.map(({ value, label }) => ({
            label,
            onClick: setGroupTopicVisibility(groupTopic.id, value),
            className: styles[`visibilityDropdown${label}`]
          }))}
        />
      )}
      {singleGroup && isSuggested && (
        <Icon name='Trash' onClick={removeSuggestedTopic(groupTopic.id)} className={styles.removeSuggestedTopicButton} />
      )}
    </div>
  )
}

export default withTranslation()(TopicsSettingsTab)
