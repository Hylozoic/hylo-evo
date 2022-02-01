import React from 'react'
import cx from 'classnames'
import { useSelector } from 'react-redux'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import ScrollListener from 'components/ScrollListener'
import GroupCard from 'components/GroupCard'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import './GroupSearch.scss'
import getPublicGroups from 'store/selectors/getPublicGroups'

export default function GroupSearch ({ sortBy = 'nearest', changeSort = () => {}, search = '', pending = false, groups = [], pageGroups = () => { console.log('I love lamp, and I just paged for more groups') }, routeParams = {}, selectedGroupId = null }) {
  // const { sortBy, changeSort } = props
  groups = useSelector(state => getPublicGroups(state))

  // TODO: GroupSearch needs to ensure it requests the required fields

  return <React.Fragment>
    <div styleName='group-search-view-ctrls'>
      <b>Group Search</b>
      { makeDropdown(sortBy, sortOptions, changeSort) }
    </div>
    <div styleName='search-input'>
      <div className='spacer' />
      <input
        styleName='searchBox'
        type='text'
        // onChange={e => setSearch(e.target.value)}
        // onFocus={e => setIsSearching(true)}
        // onKeyUp={e => {
        //   if (e.keyCode === 13) {
        //     setSearch('')
        //     setIsSearching(false)
        //     onUpdateFilters({ search: e.target.value })
        //     e.target.blur()
        //   }
        // }}
        placeholder='Search groups by keyword'
        value={search}
      />
      <div className='spacer' />
    </div>
    <div styleName='group-search-items'>
      {!pending && groups.length === 0 ? <NoPosts message='No results for this search' /> : ''}
      {groups.map(group => {
        const expanded = selectedGroupId === group.id
        return <GroupCard
          styleName={cx({ 'card-item': true, expanded })}
          expanded={expanded}
          routeParams={routeParams}
          group={group}
          key={group.id} />
      })}
    </div>
    {/* Need to change this fetch */}
    <ScrollListener onBottom={() => pageGroups(groups)}
      elementId={CENTER_COLUMN_ID} />
    {pending && <Loading />}
  </React.Fragment>
}

const sortOptions = [
  { id: 'name', label: 'Group Name' },
  { id: 'nearest', label: 'Nearest' },
  { id: 'size', label: 'Member Count' }
]

const makeDropdown = (selected, options, onChange) => (
  <Dropdown styleName='dropdown'
    toggleChildren={<span styleName='dropdown-label'>
      <Icon name='ArrowDown' />
      Sort by: <b>{options.find(o => o.id === selected).label}</b>
    </span>}
    items={options.map(({ id, label }) => ({
      label,
      onClick: () => onChange(id)
    }))} />
)
