import { find } from 'lodash/fp'
import { boolean, arrayOf, func, number, shape, string } from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'

import CreateTopic from 'components/CreateTopic'
import Dropdown from 'components/Dropdown'
import FullPageModal from 'routes/FullPageModal'
import Icon from 'components/Icon'
import ScrollListener from 'components/ScrollListener'
import TextInput from 'components/TextInput'
import { inflectedTotal, tagUrl } from 'util/index'
import './AllTopics.scss'

const sortOptions = [
  {id: 'num_followers', label: 'Popular'},
  {id: 'updated_at', label: 'Recent'}
]

const TOPIC_LIST_ID = 'topic-list'

export default class AllTopics extends Component {
  state = {
    createTopicModalVisible: false
  }

  static propTypes = {
    communityTopics: arrayOf(shape({
      topic: shape({
        id: string.isRequired,
        name: string.isRequired
      }).isRequired,
      id: string,
      postsTotal: number,
      followersTotal: number,
      isSubscribed: boolean
    })),
    totalTopics: number,
    selectedSort: string,
    setSort: func,
    search: string,
    setSearch: func,
    toggleSubscribe: func.isRequired
  }

  componentDidMount () {
    this.props.fetchCommunityTopics()
    // Caching totalTopics because the total returned in the queryset
    // changes when there is a search term
    this.setState({totalTopicsCached: this.props.totalTopics})
  }

  componentDidUpdate (prevProps) {
    if (!this.state.totalTopicsCached && !prevProps.totalTopics && this.props.totalTopics) {
      this.setState({totalTopicsCached: this.props.totalTopics})
    }
    if (prevProps.selectedSort !== this.props.selectedSort ||
      prevProps.search !== this.props.search) {
      this.props.fetchCommunityTopics()
    }
  }

  toggleTopicModal = () =>
    this.setState({
      createTopicModalVisible: !this.state.createTopicModalVisible
    })

  render () {
    const {
      community,
      communityTopics,
      search,
      setSearch,
      selectedSort,
      setSort,
      toggleSubscribe,
      fetchIsPending,
      fetchMoreCommunityTopics,
      canModerate,
      deleteTopic
    } = this.props

    const { totalTopicsCached } = this.state

    return <FullPageModal>
      <div styleName='all-topics'>
        <div styleName='title'>Topics</div>
        <div styleName='subtitle'>{totalTopicsCached} Total Topics</div>
        <div styleName='controls'>
          <SearchBar {...{search, setSearch, selectedSort, setSort, fetchIsPending}} />
          <CreateTopic
            buttonText='Add a Topic'
            communityId={community.id}
            communitySlug={community.slug}
            communityTopics={communityTopics} />
        </div>
        <div styleName='topic-list' id={TOPIC_LIST_ID}>
          {communityTopics.map(ct =>
            <CommunityTopicListItem key={ct.id} item={ct} slug={community.slug}
              canModerate={canModerate}
              deleteTopic={() => deleteTopic(ct)}
              toggleSubscribe={() =>
                toggleSubscribe(ct.topic.id, !ct.isSubscribed)} />)}
          <ScrollListener onBottom={() => fetchMoreCommunityTopics()}
            elementId={TOPIC_LIST_ID} />
        </div>
      </div>
    </FullPageModal>
  }
}

export function SearchBar ({search, setSearch, selectedSort, setSort, fetchIsPending}) {
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

export function CommunityTopicListItem ({ item, slug, toggleSubscribe, deleteTopic, canModerate }) {
  const { topic: { name }, postsTotal, followersTotal, isSubscribed } = item

  const dropdownItems = []
  if (canModerate) dropdownItems.push({icon: 'Trash', label: 'Delete', onClick: deleteTopic, red: true})

  return <div styleName='topic'>
    <Link styleName='topic-details' to={tagUrl(name, slug)}>
      <div styleName='topic-name'>#{name}</div>
      <div styleName='topic-stats'>{inflectedTotal('post', postsTotal)} • {inflectedTotal('follower', followersTotal)}</div>
    </Link>
    <span onClick={toggleSubscribe} styleName='topic-subscribe'>
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </span>
    {canModerate && <Dropdown styleName='topic-dropdown' toggleChildren={<Icon name='More' />} items={dropdownItems} />}
  </div>
}
