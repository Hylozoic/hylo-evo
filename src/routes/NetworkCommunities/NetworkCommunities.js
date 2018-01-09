import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './NetworkCommunities.scss'
import { DEFAULT_AVATAR } from 'store/models/Community'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import RoundImage from 'components/RoundImage'
import { find, get } from 'lodash/fp'
import ScrollListener from 'components/ScrollListener'
import { CENTER_COLUMN_ID } from 'util/scrolling'

const { string, array, func, object } = PropTypes

const sortOptions = [
  {id: 'name', label: 'Alphabetical'},
  {id: 'num_members', label: 'Popular'},
  {id: 'created_at', label: 'Newest'}
]

export default class NetworkCommunities extends Component {
  static propTypes = {
    network: object,
    communities: array,
    search: string,
    setSearch: func,
    sortBy: string,
    setSort: func
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidMount () {
    this.props.fetchNetwork()
  }

  componentDidUpdate (prevProps) {
    const { search, sortBy, fetchMoreCommunities, communitiesTotal } = this.props
    if (search !== prevProps.search || sortBy !== prevProps.sortBy) {
      fetchMoreCommunities()
    }

    if (communitiesTotal && !this.state.communitiesTotal) {
      this.setState({communitiesTotal})
    }
  }

  render () {
    const { network, communities, search, setSearch, sortBy, setSort, fetchMoreCommunities } = this.props
    const { communitiesTotal } = this.state
    return <div styleName='container'>
      <Banner network={network} communitiesTotal={communitiesTotal} />
      <SearchBar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSort={setSort} />
      <CommunityList
        communities={communities}
        fetchMoreCommunities={fetchMoreCommunities} />
    </div>
  }
}

export function Banner ({ network, communitiesTotal }) {
  return <div styleName='banner'>
    <div styleName='banner-text'>
      <div styleName='name'>Communities</div>
      <div styleName='stats'>
        {communitiesTotal} Communities&nbsp;&nbsp;•&nbsp;&nbsp;{get('memberCount', network, 0)} Total Members
      </div>
    </div>
    <Icon name='More' styleName='icon' />
  </div>
}

export function SearchBar ({ search, setSearch, sortBy, setSort }) {
  var selected = find(o => o.id === sortBy, sortOptions)

  if (!selected) selected = sortOptions[0]

  return <div styleName='search-bar'>
    <TextInput styleName='search-input'
      value={search}
      placeholder='Search by name'
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

export function CommunityList ({ communities, fetchMoreCommunities }) {
  return <div styleName='community-list' >
    {communities.map(c => <CommunityCard community={c} key={c.id} />)}
    <ScrollListener onBottom={() => fetchMoreCommunities()}
      elementId={CENTER_COLUMN_ID} />
  </div>
}

export function CommunityCard ({ community }) {
  return <div styleName='community-card'>
    <RoundImage url={community.avatarUrl || DEFAULT_AVATAR} styleName='community-image' size='50px' square />
    <div styleName='community-details'>
      <span styleName='community-name'>{community.name}</span>
      <span styleName='community-stats'>{community.numMembers} Members</span>
    </div>
  </div>
}
