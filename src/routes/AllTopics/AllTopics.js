import { find } from 'lodash/fp'
import { boolean, arrayOf, func, number, shape, string, object } from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
// import CreateTopic from 'components/CreateTopic'
import { CommunityCell } from 'components/CommunitiesList/CommunitiesList'
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
    community: object,
    network: object,
    routeParams: object.isRequired,
    totalTopics: number,
    selectedSort: string,
    setSort: func,
    search: string,
    setSearch: func,
    toggleCommunityTopicSubscribe: func.isRequired
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
      prevProps.routeParams.networkSlug !== this.props.routeParams.networkSlug ||
      prevProps.routeParams.communitySlug !== this.props.routeParams.communitySlug) {
      this.props.fetchTopics()
    }
  }

  deleteCommunityTopic (communityTopicId) {
    if (window.confirm('Are you sure you want to delete this communityTopic?')) {
      this.props.deleteCommunityTopic(communityTopicId)
    }
  }

  toggleTopicModal = () =>
    this.setState({
      createTopicModalVisible: !this.state.createTopicModalVisible
    })

  render () {
    const {
      routeParams,
      community,
      network,
      topics,
      search,
      setSearch,
      selectedSort,
      setSort,
      fetchMoreTopics,
      fetchIsPending,
      canModerate,
      toggleCommunityTopicSubscribe
    } = this.props
    const { totalTopicsCached } = this.state

    return <FullPageModal fullWidth goToOnClose={baseUrl({ ...routeParams, view: undefined })}>
      <div styleName='all-topics'>
        <div styleName='title'>{community ? community.name : network ? network.name : 'All'} Topics</div>
        <div styleName='subtitle'>{totalTopicsCached} Total Topics</div>
        <div styleName='controls'>
          <SearchBar {...{ search, setSearch, selectedSort, setSort, fetchIsPending }} />
          {/* {community && <CreateTopic
            buttonText='Add a Topic'
            communityId={community.id}
            communitySlug={community.slug}
            communityTopics={communityTopics} />} */}
        </div>
        <div styleName='topic-list' id={TOPIC_LIST_ID}>
          {topics.map(topic =>
            <TopicListItem
              key={topic.id}
              singleCommunity={community}
              topic={topic}
              routeParams={routeParams}
              canModerate={canModerate}
              deleteItem={this.deleteCommunityTopic}
              toggleSubscribe={toggleCommunityTopicSubscribe} />)}
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

export function TopicListItem ({ topic, singleCommunity, routeParams, toggleSubscribe, deleteItem, canModerate }) {
  const { name, communityTopics, postsTotal, followersTotal } = topic
  let communityTopicContent

  if (singleCommunity) {
    // Grab correct CommunityTopic object
    const communityTopic = topic.communityTopics.find(ct => ct.community.id === singleCommunity.id)

    // Don't show hidden topics unless user is subscribed to it
    if (!communityTopic || (!communityTopic.isSubscribed && communityTopic.visibility === 0)) return ''

    communityTopicContent = <div styleName='topic-stats'>
      {inflectedTotal('post', postsTotal)} • {inflectedTotal('subscriber', followersTotal)} •
      {toggleSubscribe && <span onClick={() => toggleSubscribe(communityTopic)} styleName='topic-subscribe'>
        {communityTopic.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </span>}
    </div>
  } else {
    // Don't show hidden topics unless user is subscribed to it
    const visibleCommunityTopics = communityTopics.filter(ct => ct.isSubscribed || ct.visibility !== 0)
    if (visibleCommunityTopics.length === 0) return ''

    communityTopicContent = visibleCommunityTopics.map((ct, key) => <CommunityCell community={ct.community} key={key}>
      <div styleName='topic-stats'>
        {inflectedTotal('post', ct.postsTotal)} • {inflectedTotal('subscriber', ct.followersTotal)} •
        {toggleSubscribe && <span onClick={() => toggleSubscribe(ct)} styleName='topic-subscribe'>
          {ct.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
        </span>}
      </div>
      <br />
    </CommunityCell>)
  }

  return <div styleName='topic'>
    <div styleName='communitiesList'>
      <Link styleName='topic-details' to={topicUrl(name, routeParams)}>
        <div styleName='topic-name'>#{name}</div>
      </Link>
      {communityTopicContent}
    </div>
  </div>
}
