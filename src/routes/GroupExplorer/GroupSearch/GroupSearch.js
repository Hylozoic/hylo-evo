import React, { useState } from 'react'
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
// import getPublicGroups from 'store/selectors/getPublicGroups'
import { SORT_NAME, SORT_NEAREST, SORT_SIZE } from 'store/constants'
import useRouter from 'hooks/useRouter'
import useDebounce from 'hooks/useDebounce'

export default function GroupSearch ({ pageGroups = () => { console.log('I love lamp, and I just paged for more groups') } }) {
  // const { sortBy, changeSort } = props
  
  const [sortBy, setSortBy] = useState(SORT_NEAREST)
  const [search, setSearch] = useState('')
  const debouncedSearchTerm = useDebounce(search, 500)
  const { query } = useRouter()
  const { groups = [], pending = false } = ensureSearchedGroups({ sortBy, search: debouncedSearchTerm })
  // groups = useSelector(state => getPublicGroups(state))
  const selectedGroupSlug = query.groupSlug

  return <React.Fragment>
    <div styleName='group-search-view-ctrls'>
      <b>Group Search</b>
      { makeDropdown(sortBy, sortOptions, setSortBy) }
    </div>
    <div styleName='search-input'>
      <div className='spacer' />
      <input
        styleName='searchBox'
        type='text'
        onChange={e => setSearch(e.target.value)} // debounce this
        placeholder='Search groups by keyword'
        value={search}
      />
      <div className='spacer' />
    </div>
    <div styleName='group-search-items'>
      {!pending && groups.length === 0 ? <NoPosts message='No results for this search' /> : ''}
      {groups.map(group => {
        const expanded = selectedGroupSlug === group.slug
        return <GroupCard
          styleName={cx({ 'card-item': true, expanded })}
          expanded={expanded}
          routeParams={routeParams}
          group={group}
          key={group.id} />
      })}
    </div>
    {/* Need to change this fetch */}
    <ScrollListener onBottom={() => pageGroups(groups.length)}
      elementId={CENTER_COLUMN_ID} />
    {pending && <Loading />}
  </React.Fragment>
}

const sortOptions = [
  { id: SORT_NAME, label: 'Group Name' },
  { id: SORT_NEAREST, label: 'Nearest' },
  { id: SORT_SIZE, label: 'Member Count' }
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
