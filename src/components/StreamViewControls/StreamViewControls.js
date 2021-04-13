import React from 'react'
import cx from 'classnames'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import './StreamViewControls.scss'

const sortOptions = [
  { id: 'created', label: 'Most recent' },
  { id: 'updated', label: 'Latest activity' },
  { id: 'votes', label: 'Popular' }
]

const postTypeOptions = [
  { id: undefined, label: 'All' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'event', label: 'Events' },
  { id: 'project', label: 'Projects' },
  { id: 'offer', label: 'Offers' },
  { id: 'request', label: 'Requests' }
]

const makeDropdown = (selected, options, onChange) => (
  <Dropdown styleName='dropdown'
    toggleChildren={<span styleName='dropdown-label'>
      <Icon name='ArrowDown' />
      {options.find(o => o.id === selected).label}
    </span>}
    items={options.map(({ id, label }) => ({
      label,
      onClick: () => onChange(id)
    }))} />
)

const StreamViewControls = (props) => {
  const { sortBy, postTypeFilter, viewMode, changeSort, changeTab, changeView } = props

  return (
    <div styleName='stream-view-ctrls'>
      <div styleName='view-mode'>
        <div
          styleName={cx({ 'mode-active': viewMode === 'cards' })}
          onClick={() => changeView('cards')}
          data-tip='Card view' data-for='stream-viewmode-tip'
        >
          <Icon name='CardView' />
        </div>
        <div
          styleName={cx({ 'mode-active': viewMode !== 'cards' })}
          onClick={() => changeView('list')}
          data-tip='List view' data-for='stream-viewmode-tip'
        >
          <Icon name='ListView' />
        </div>
      </div>
      { makeDropdown(sortBy, sortOptions, changeSort) }
      { makeDropdown(postTypeFilter, postTypeOptions, changeTab) }
      <Tooltip id='stream-viewmode-tip' />
    </div>
  )
}

export default StreamViewControls
