import cx from 'classnames'
import { find } from 'lodash/fp'
import { boolean, arrayOf, func, number, shape, string, object } from 'prop-types'
import React, { Component } from 'react'
import CreateTopic from 'components/CreateTopic'
// import { CommunityCell } from 'components/CommunitiesList/CommunitiesList'
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
  isSubscribed: boolean
})

export default class TopicsSettingsTab extends Component {
  state = {
    createTopicModalVisible: false
  }

  static propTypes = {
    community: object.isRequired,
    defaultTopics: arrayOf(topicType),
    topics: arrayOf(topicType),
    network: object,
    selectedSort: string,
    setSort: func,
    search: string,
    setSearch: func,
    setCommunityTopicVisibility: func.isRequired,
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
    if (prevProps.fetchTopicsParams.communitySlug !== this.props.fetchTopicsParams.communitySlug) {
      this.props.fetchTopics()
      this.props.fetchDefaultTopics()
    } else if (prevProps.selectedSort !== this.props.selectedSort || prevProps.search !== this.props.search) {
      this.props.fetchTopics()
    }
  }

  setCommunityTopicVisibility = (communityTopicId, value) => (e) => {
    e.preventDefault()
    this.props.setCommunityTopicVisibility(communityTopicId, value)
  }

  removeSuggestedTopic = (communityTopicId) => (e) => {
    e.preventDefault()
    this.props.setCommunityTopicIsDefault(communityTopicId, false)
  }

  toggleTopicModal = () =>
    this.setState({
      createTopicModalVisible: !this.state.createTopicModalVisible
    })

  render () {
    const {
      community,
      defaultTopics,
      topics,
      search,
      setSearch,
      selectedSort,
      setSort,
      fetchMoreTopics,
      fetchIsPending
    } = this.props
    const { totalTopicsCached } = this.state

    return (<div styleName='wrapper'>
      <div styleName='default-topics'>
        <div styleName='title'>Community Suggested Topics</div>
        <p>
          Set default topics for your community which will be suggested first when
          members are creating a new post.
          Every new member will also be subscribed to these topics when they join.
        </p>
        <div styleName='default-topic-list'>
          {defaultTopics.map(topic =>
            <TopicListItem
              key={topic.id}
              singleCommunity={community}
              topic={topic}
              setCommunityTopicVisibility={this.setCommunityTopicVisibility}
              removeSuggestedTopic={this.removeSuggestedTopic}
              isSuggested
            />
          )}
          <div styleName='default-topic-selector'>
            <SingleTopicSelector
              currentCommunity={community}
              placeholder='Add a suggested topic'
              onSelectTopic={(topic) => {
                topic && this.props.createTopic(topic.name, community.id, true, false)
              }}
            />
          </div>
        </div>
      </div>
      <div styleName='all-topics'>
        <div styleName='title'>Topic List Editor</div>
        <p>
          Below is a list of every topic that any member of your community has used to date. You can choose to hide
          topics that you would prefer members of your community don't use, or pin topics to the top of the list
          to make sure people pay attention to posts in those topics.
        </p>
        <div styleName='controls'>
          <SearchBar {...{ search, setSearch, selectedSort, setSort, fetchIsPending, totalTopicsCached }} />
          <CreateTopic
            buttonText='Add a Topic'
            communityId={community.id}
            communitySlug={community.slug}
            topics={topics} />
        </div>
        <div styleName='topic-list' id={TOPIC_LIST_ID}>
          {topics.map(topic =>
            <TopicListItem
              key={topic.id}
              singleCommunity={community}
              topic={topic}
              canModerate
              setCommunityTopicVisibility={this.setCommunityTopicVisibility}
            />
          )}
          <ScrollListener onBottom={() => fetchMoreTopics()} elementId={TOPIC_LIST_ID} />
        </div>
      </div>
    </div>)
  }
}

export function SearchBar ({ search, setSearch, selectedSort, setSort, fetchIsPending, totalTopicsCached }) {
  var selected = find(o => o.id === selectedSort, sortOptions)

  if (!selected) selected = sortOptions[0]

  return <div styleName='search-bar'>
    <TextInput styleName='search-input'
      value={search}
      placeholder={`Search ${totalTopicsCached || ''} topics`}
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

export function TopicListItem ({ topic, singleCommunity, setCommunityTopicVisibility, removeSuggestedTopic, isSuggested }) {
  const { name, communityTopics, postsTotal, followersTotal } = topic

  const communityTopic = communityTopics.find(ct => ct.community.id === singleCommunity.id)

  return <div styleName='topic'>
    <div styleName='topic-name'>#{name}</div>
    {singleCommunity &&
      <div styleName='topic-stats'>{inflectedTotal('post', postsTotal)} • {inflectedTotal('subscriber', followersTotal)}</div>}
    {singleCommunity && !isSuggested && (
      <Dropdown
        alignRight
        styleName='visibility-dropdown'

        toggleChildren={<span styleName={cx('visibility-dropdown-label', 'visibilityDropdown' + TOPIC_VISIBILITY[communityTopic.visibility])}>
          <Icon name='Eye' />
          <span styleName='label-content'>{TOPIC_VISIBILITY[communityTopic.visibility]}</span>
          <Icon name='ArrowDown' />
        </span>}

        items={visibilityOptions.map(({ value, label }) => ({
          label,
          onClick: setCommunityTopicVisibility(communityTopic.id, value),
          styleName: styles['visibilityDropdown' + label]
        }))}
      />
    )}
    {singleCommunity && isSuggested && (
      <Icon name='Trash' onClick={removeSuggestedTopic(communityTopic.id)} styleName='remove-suggested-topic-button' />
    )}
  </div>
}
