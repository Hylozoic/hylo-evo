import React from 'react'
import cx from 'classnames'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import { STREAM_SORT_OPTIONS } from 'util/constants'

import './StreamViewControls.scss'

const POST_TYPE_OPTIONS = [
  { id: undefined, label: 'All Posts' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'event', label: 'Events' },
  { id: 'offer', label: 'Offers' },
  { id: 'project', label: 'Projects' },
  { id: 'request', label: 'Requests' },
  { id: 'resource', label: 'Resources' }
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
      { makeDropdown(sortBy, STREAM_SORT_OPTIONS, changeSort) }
      { makeDropdown(postTypeFilter, POST_TYPE_OPTIONS, changeTab) }
      <Tooltip id='stream-viewmode-tip' position='bottom' />
    </div>
  )
}

export default StreamViewControls
