import React, { useState } from 'react'
import cx from 'classnames'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import './StreamViewControls.scss'

const sortOptions = [
  { id: 'updated', label: 'Latest activity' },
  { id: 'created', label: 'Post Date' },
  { id: 'votes', label: 'Popular' }
]

const postTypeOptions = [
  { id: undefined, label: 'All Posts' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'event', label: 'Events' },
  { id: 'offer', label: 'Offers' },
  { id: 'project', label: 'Projects' },
  { id: 'request', label: 'Requests' },
  { id: 'resource', label: 'Resources' }
]

const makeDropdown = (selected, options, onChange) => (
  <Dropdown
    styleName='dropdown'
    toggleChildren={
      <span styleName='dropdown-label'>
        <Icon name='ArrowDown' />
        {options.find(o => o.id === selected).label}
      </span>
    }
    items={options.map(({ id, label }) => ({
      label,
      onClick: () => onChange(id)
    }))}
  />
)

const StreamViewControls = (props) => {
  const { sortBy, postTypeFilter, viewMode, changeSearch, changeSort, changeTab, changeView, searchValue, view } = props
  const [searchActive, setSearchActive] = useState(!!searchValue)
  const [searchState, setSearchState] = useState('')
  const handleSearchToggle = () => {
    changeSearch('')
    setSearchActive(!searchActive)
  }
  return (
    <div styleName={cx('stream-view-container', { 'search-active': searchActive })}>
      <div styleName='stream-view-ctrls'>
        <div styleName={cx('search-toggle', { active: searchActive })} onClick={handleSearchToggle}>
          <Icon name='Search' styleName={cx('search-icon', { active: searchActive })} />
        </div>
        <div styleName='view-mode'>
          <div
            styleName={cx({ 'mode-active': viewMode === 'cards' })}
            onClick={() => changeView('cards')}
            data-tip='Card view' data-for='stream-viewmode-tip'
          >
            <Icon name='CardView' />
          </div>

          <div
            styleName={cx({ 'mode-active': viewMode === 'list' })}
            onClick={() => changeView('list')}
            data-tip='List view' data-for='stream-viewmode-tip'
          >
            <Icon name='ListView' />
          </div>

          <div
            styleName={cx({ 'mode-active': viewMode === 'bigGrid' })}
            onClick={() => changeView('bigGrid')}
            data-tip='Large Grid' data-for='stream-viewmode-tip'
          >
            <Icon name='GridView' styleName='grid-view-icon' />
          </div>

          <div
            styleName={cx({ 'mode-active': viewMode === 'grid' }, 'small-grid')}
            onClick={() => changeView('grid')}
            data-tip='Small Grid' data-for='stream-viewmode-tip'
          >
            <Icon name='SmallGridView' styleName='grid-view-icon' />
          </div>
        </div>
        {makeDropdown(sortBy, sortOptions, changeSort)}
        {!['projects'].includes(view) && makeDropdown(postTypeFilter, postTypeOptions, changeTab)}
        <Tooltip id='stream-viewmode-tip' position='bottom' />
      </div>
      {searchActive && !searchValue &&
        <div>
          <input
            autoFocus
            styleName='search-box'
            type='text'
            onChange={e => setSearchState(e.target.value)}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                setSearchState('')
                changeSearch(e.target.value)
                e.target.blur()
              }
            }}
            placeholder='Search posts'
            value={searchState}
          />
        </div>}
      {searchValue &&
        <div
          styleName='search-value'
          onClick={() => changeSearch('')}
        >
          &quot;{searchValue}&quot;
          <Icon name='Ex' styleName='text-ex' />
        </div>}
    </div>
  )
}

export default StreamViewControls
