import { find } from 'lodash/fp'
import { boolean, arrayOf, func, number, shape, string, object } from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import CreateTopic from 'components/CreateTopic'
import { GroupCell } from 'components/GroupsList/GroupsList'
import Dropdown from 'components/Dropdown'
import FullPageModal from 'routes/FullPageModal'
import Icon from 'components/Icon'
import ScrollListener from 'components/ScrollListener'
import TextInput from 'components/TextInput'
import { inflectedTotal } from 'util/index'
import { topicUrl, baseUrl } from 'util/navigation'
import './AllTopics.scss'

const sortOptions = [
  { id: 'name', label: 'Name' },
  { id: 'num_followers', label: 'Popular' },
  { id: 'updated_at', label: 'Recent' }
]

const TOPIC_LIST_ID = 'topic-list'

export default class AllTopics extends Component {
  state = {
    createTopicModalVisible: false
  }

  static propTypes = {
    topics: arrayOf(shape({
      id: string,
      name: string.isRequired,
      postsTotal: number,
      followersTotal: number,
      isSubscribed: boolean
    })),
    group: object,
    routeParams: object.isRequired,
    totalTopics: number,
    selectedSort: string,
    setSort: func,
    search: string,
    setSearch: func,
    toggleGroupTopicSubscribe: func.isRequired
  }

  componentDidMount () {
    this.props.fetchTopics()

    // Caching totalTopics because the total returned in the queryset
    // changes when there is a search term
    this.setState({
      totalTopicsCached: this.props.totalTopics
    })
  }

  componentWillUnmount () {
    this.props.setSearch('')
  }

  componentDidUpdate (prevProps) {
    if (!this.state.totalTopicsCached && !prevProps.totalTopics && this.props.totalTopics) {
      this.setState({ totalTopicsCached: this.props.totalTopics })
    }
    if (prevProps.selectedSort !== this.props.selectedSort ||
      prevProps.search !== this.props.search ||
      prevProps.routeParams.groupSlug !== this.props.routeParams.groupSlug) {
      this.props.fetchTopics()
    }
  }

  deleteGroupTopic (groupTopicId) {
    if (window.confirm('Are you sure you want to delete this groupTopic?')) {
      this.props.deleteGroupTopic(groupTopicId)
    }
  }

  toggleTopicModal = () =>
    this.setState({
      createTopicModalVisible: !this.state.createTopicModalVisible
    })

  render () {
    const {
      routeParams,
      group,
      topics,
      search,
      setSearch,
      selectedSort,
      setSort,
      fetchMoreTopics,
      fetchIsPending,
      canModerate,
      toggleGroupTopicSubscribe
    } = this.props
    const { totalTopicsCached } = this.state

    return <FullPageModal fullWidth goToOnClose={baseUrl({ ...routeParams, view: undefined })}>
      <div styleName='all-topics'>
        <div styleName='title'>{group ? group.name : 'All'} Topics</div>
        <div styleName='subtitle'>{totalTopicsCached} Total Topics</div>
        <div styleName='controls'>
          <SearchBar {...{ search, setSearch, selectedSort, setSort, fetchIsPending }} />
          {/* {group && <CreateTopic
            buttonText='Add a Topic'
            groupId={group.id}
            groupSlug={group.slug}
            groupTopics={groupTopics} />} */}
        </div>
        <div styleName='topic-list' id={TOPIC_LIST_ID}>
          {topics.map(topic =>
            <TopicListItem
              key={topic.id}
              singleGroup={group}
              topic={topic}
              routeParams={routeParams}
              canModerate={canModerate}
              deleteItem={this.deleteGroupTopic}
              toggleSubscribe={toggleGroupTopicSubscribe} />)}
          <ScrollListener onBottom={() => fetchMoreTopics()}
            elementId={TOPIC_LIST_ID} />
        </div>
      </div>
    </FullPageModal>
  }
}

export function SearchBar ({ search, setSearch, selectedSort, setSort, fetchIsPending }) {
  var selected = find(o => o.id === selectedSort, sortOptions)

  if (!selected) selected = sortOptions[0]

  return <div styleName='search-bar'>
    <TextInput styleName='search-input'
      value={search}
      placeholder='Search topics'
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

export function TopicListItem ({ topic, singleGroup, routeParams, toggleSubscribe, deleteItem, canModerate }) {
  const { name, groupTopics, postsTotal, followersTotal } = topic
  let groupTopicContent

  if (singleGroup) {
    // Grab correct GroupTopic object
    const groupTopic = topic.groupTopics.find(ct => ct.group.id === singleGroup.id)

    // Don't show hidden topics unless user is subscribed to it
    if (!groupTopic || (!groupTopic.isSubscribed && groupTopic.visibility === 0)) return ''

    groupTopicContent = <div styleName='topic-stats'>
      {inflectedTotal('post', postsTotal)} • {inflectedTotal('subscriber', followersTotal)} •
      {toggleSubscribe && <span onClick={() => toggleSubscribe(groupTopic)} styleName='topic-subscribe'>
        {groupTopic.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </span>}
    </div>
  } else {
    // Don't show hidden topics unless user is subscribed to it
    const visibleGroupTopics = groupTopics.filter(ct => ct.isSubscribed || ct.visibility !== 0)
    if (visibleGroupTopics.length === 0) return ''

    groupTopicContent = visibleGroupTopics.map((ct, key) => <GroupCell group={ct.group} key={key}>
      <div styleName='topic-stats'>
        {inflectedTotal('post', ct.postsTotal)} • {inflectedTotal('subscriber', ct.followersTotal)} •
        {toggleSubscribe && <span onClick={() => toggleSubscribe(ct)} styleName='topic-subscribe'>
          {ct.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </span>}
      </div>
      <br />
    </GroupCell>)
  }

  return <div styleName='topic'>
    <div styleName='groupsList'>
      <Link styleName='topic-details' to={topicUrl(name, routeParams)}>
        <div styleName='topic-name'>#{name}</div>
      </Link>
      {groupTopicContent}
    </div>
  </div>
}
