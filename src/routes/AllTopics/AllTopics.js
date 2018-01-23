import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import './AllTopics.scss'
import FullPageModal from 'routes/FullPageModal'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import { pluralize, tagUrl } from 'utils/index'
import { find } from 'lodash/fp'
import ScrollListener from 'components/ScrollListener'
const { boolean, arrayOf, func, number, shape, string } = PropTypes

const sortOptions = [
  {id: 'num_followers', label: 'Popular'},
  {id: 'updated_at', label: 'Recent'}
]

const TOPIC_LIST_ID = 'topic-list'

export default class AllTopics extends Component {
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

  constructor (props) {
    super(props)
    this.state = {}
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

  render () {
    const {
      communityTopics,
      slug,
      search,
      setSearch,
      selectedSort,
      setSort,
      toggleSubscribe,
      fetchIsPending,
      fetchMoreCommunityTopics
    } = this.props

    const { totalTopicsCached } = this.state

    return <FullPageModal>
      <div styleName='all-topics'>
        <div styleName='title'>Topics</div>
        <div styleName='subtitle'>{totalTopicsCached} Total Topics</div>
        <SearchBar {...{search, setSearch, selectedSort, setSort, fetchIsPending}} />
        <div styleName='topic-list' id={TOPIC_LIST_ID}>
          {communityTopics.map(ct =>
            <CommunityTopicListItem key={ct.id} item={ct} slug={slug}
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

export function CommunityTopicListItem ({ item, slug, toggleSubscribe }) {
  const { topic: { name }, postsTotal, followersTotal, isSubscribed } = item
  return <div styleName='topic'>
    <Link styleName='topic-details' to={tagUrl(name, slug)}>
      <div styleName='topic-name'>#{name}</div>
      <div styleName='topic-stats'>{pluralize(postsTotal, 'post')} • {pluralize(followersTotal, 'follower')}</div>
    </Link>
    <span onClick={toggleSubscribe} styleName='topic-subscribe'>
      {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </span>
  </div>
}
