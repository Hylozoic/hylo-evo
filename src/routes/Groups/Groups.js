import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { DEFAULT_AVATAR } from 'store/models/Group'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import TextInput from 'components/TextInput'
import RoundImage from 'components/RoundImage'
import { find } from 'lodash/fp'
import { Link } from 'react-router-dom'

import './Groups.scss'

// import ScrollListener from 'components/ScrollListener'
// import { CENTER_COLUMN_ID } from 'util/scrolling'

const { string, array, func } = PropTypes

const sortOptions = [
  { id: 'name', label: 'Alphabetical' },
  { id: 'num_members', label: 'Popular' },
  { id: 'created_at', label: 'Newest' }
]

export default class Groups extends Component {
  static propTypes = {
    childGroups: array,
    parentGroups: array,
    // search: string,
    // setSearch: func,
    // sortBy: string,
    // setSort: func
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate (prevProps) {
    // const { search, sortBy, fetchMoreGroups, groupsTotal } = this.props
    // if (search !== prevProps.search || sortBy !== prevProps.sortBy) {
    //   fetchMoreGroups()
    // }

    // if (groupsTotal && !this.state.groupsTotal) {
    //   this.setState({ groupsTotal })
    // }
  }

  render () {
    const { childGroups, parentGroups } = this.props
    // const { groupsTotal } = this.state

    return <div styleName='container'>
      <Banner text='Parent Groups' groupsTotal={parentGroups.length} />
      {/* <SearchBar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSort={setSort} /> */}
      <GroupsList
        groups={parentGroups}
      />
      <Banner text='Child Groups' groupsTotal={childGroups.length} />
      {/* <SearchBar
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSort={setSort} /> */}
      <GroupsList
        groups={childGroups}
      />
    </div>
  }
}

export function Banner ({ text, groupsTotal }) {
  return <div styleName='banner'>
    <div styleName='banner-text'>
      <div styleName='stats'>
        {groupsTotal} {text}
      </div>
    </div>
    {/* <Icon name='More' styleName='icon' /> */}
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

export function GroupsList ({ groups, fetchMoreGroups }) {
  return <div styleName='group-list' >
    {groups.map(c => <GroupCard group={c} key={c.id} />)}
    {/* <ScrollListener onBottom={() => fetchMoreGroups()}
      elementId={CENTER_COLUMN_ID} /> */}
  </div>
}

export function GroupCard ({ group }) {
  return <div styleName='group-card'>
    <Link to={groupUrl(group.slug, 'groups')}>
      <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} styleName='group-image' size='50px' square />
      <div styleName='group-details'>
        <span styleName='group-name'>{group.name}</span>
        <span styleName='group-stats'>{group.memberCount} Members</span>
      </div>
    </Link>
  </div>
}
