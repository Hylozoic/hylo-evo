import React, { PropTypes, Component } from 'react'
import './NetworkCommunities.scss'
const { string, array, func, object } = PropTypes
import Icon from 'components/Icon'

const sortOptions = [ // eslint-disable-line
  {id: 'name', label: 'Alphabetical'},
  {id: 'member_count', label: 'Popular'},
  {id: 'updated_at', label: 'Newest'}
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
      <div styleName='stats'>436 Communities • 27,106 Total Members</div>
    </div>
    <Icon name='More' styleName='icon' />
  </div>
}

export function SearchBar ({ search, setSearch, sortOption, setSort }) {
  return <div />
}

export function CommunityList ({ communities, fetchMoreCommunities }) {
  return <div />
}

export function CommunityCard ({ community }) {

}
