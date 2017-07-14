import React, { PropTypes, Component } from 'react'
import './NetworkCommunities.scss'
const { string, array, func, object } = PropTypes
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import RoundImage from 'components/RoundImage'
import { find } from 'lodash/fp'

const sortOptions = [
  {id: 'updated_at', label: 'Newest'},
  {id: 'name', label: 'Alphabetical'},
  {id: 'member_count', label: 'Popular'}
]

export default class NetworkCommunities extends Component {
  static propTypes = {
    network: object,
    communities: array,
    search: string,
    setSearch: func
  }

  render () {
    const { network, communities, search, setSearch, sortOption, setSort, fetchMoreCommunities } = this.props
    return <div styleName='container'>
      <Banner network={network} />
      <SearchBar
        search={search}
        setSearch={setSearch}
        sortOption={sortOption}
        setSort={setSort} />
      <CommunityList
        communities={communities}
        fetchMoreCommunities={fetchMoreCommunities} />
    </div>
  }
}

export function Banner ({ network }) {
  return <div styleName='banner'>
    <div styleName='banner-text'>
      <div styleName='name'>Communities</div>
      <div styleName='stats'>436 Communities&nbsp;&nbsp;•&nbsp;&nbsp;27,106 Total Members</div>
    </div>
    <Icon name='More' styleName='icon' />
  </div>
}

export function SearchBar ({ search, setSearch, sortOption, setSort }) {
  var selected = find(o => o.id === sortOption, sortOptions)

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
  return <div styleName='community-list'>
    {communities.map(c => <CommunityCard community={c} />)}
  </div>
}

export function CommunityCard ({ community }) {
  return <div styleName='community-card'>
    <RoundImage url={community.avatarUrl} styleName='community-image' size='50' square />
    <div styleName='community-details'>
      <span styleName='community-name'>{community.name}</span>
      <span styleName='community-stats'>{community.memberCount} Members</span>
    </div>
  </div>
}
