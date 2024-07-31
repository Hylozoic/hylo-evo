import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import { CONTEXT_MY } from 'store/constants'
import { COLLECTION_SORT_OPTIONS, STREAM_SORT_OPTIONS } from 'util/constants'
import './StreamViewControls.scss'

const makeDropdown = (selected, options, onChange) => {
  const { t } = useTranslation()
  return (
    <Dropdown
      styleName='dropdown'
      toggleChildren={
        <span styleName='dropdown-label'>
          <Icon name='ArrowDown' />
          {t(options.find(o => o.id === selected)?.label)}
        </span>
      }
      items={options.map(({ id, label }) => ({
        label: t(label),
        onClick: () => onChange(id)
      }))}
    />
  )
}

const StreamViewControls = (props) => {
  const { t } = useTranslation()
  const POST_TYPE_OPTIONS = [
    { id: undefined, label: 'All Posts' },
    { id: 'discussion', label: 'Discussions' },
    { id: 'event', label: 'Events' },
    { id: 'offer', label: 'Offers' },
    { id: 'project', label: 'Projects' },
    { id: 'proposal', label: 'Proposals' },
    { id: 'request', label: 'Requests' },
    { id: 'resource', label: 'Resources' }
  ]

  const { customViewType, sortBy, postTypeFilter, viewMode, changeSearch, changeSort, changeTab, changeView, context, searchValue, view, customPostTypes, changeChildPostInclusion, childPostInclusion } = props
  const [searchActive, setSearchActive] = useState(!!searchValue)
  const [searchState, setSearchState] = useState('')

  const postTypeOptionsForFilter = customPostTypes && customPostTypes.length > 1 ? POST_TYPE_OPTIONS.filter(postType => postType.label === 'All Posts' || customPostTypes.includes(postType.id)) : POST_TYPE_OPTIONS
  const postTypeFilterDropdown = makeDropdown(postTypeFilter, postTypeOptionsForFilter, changeTab)

  const handleSearchToggle = () => {
    setSearchActive(!searchActive)
  }
  const handleChildPostInclusion = () => {
    const updatedValue = childPostInclusion === 'yes' ? 'no' : 'yes'
    changeChildPostInclusion(updatedValue)
  }

  return (
    <div styleName={cx('stream-view-container', { 'search-active': searchActive || searchValue, extend: searchActive && searchValue })}>
      <div styleName='stream-view-ctrls'>
        <div styleName={cx('toggle', { active: searchActive })} onClick={handleSearchToggle}>
          <Icon name='Search' styleName={cx('toggle-icon', { active: searchActive })} />
        </div>
        {![CONTEXT_MY, 'all', 'public'].includes(context) &&
          <div
            styleName={cx('toggle', 'margin-right', { active: childPostInclusion === 'yes' })}
            onClick={handleChildPostInclusion}
            data-tip={childPostInclusion === 'yes' ? t('Hide posts from child groups you are a member of') : t('Show posts from child groups you are a member of')}
            data-for='childgroup-toggle-tt'
          >
            <Icon name='Subgroup' styleName={cx('toggle-icon', 'subgroup-icon', { active: childPostInclusion === 'yes' })} />
          </div>
        }
        <Tooltip
          delay={250}
          id='childgroup-toggle-tt'
          position='bottom'
        />
        <div styleName='view-mode'>
          <div
            styleName={cx({ 'mode-active': viewMode === 'cards' })}
            onClick={() => changeView('cards')}
            data-tip={t('Card view')} data-for='stream-viewmode-tip'
          >
            <Icon name='CardView' />
          </div>

          <div
            styleName={cx({ 'mode-active': viewMode === 'list' })}
            onClick={() => changeView('list')}
            data-tip={t('List view')} data-for='stream-viewmode-tip'
          >
            <Icon name='ListView' />
          </div>

          <div
            styleName={cx({ 'mode-active': viewMode === 'bigGrid' })}
            onClick={() => changeView('bigGrid')}
            data-tip={t('Large Grid')} data-for='stream-viewmode-tip'
          >
            <Icon name='GridView' styleName='grid-view-icon' />
          </div>

          <div
            styleName={cx({ 'mode-active': viewMode === 'grid' }, 'small-grid')}
            onClick={() => changeView('grid')}
            data-tip={t('Small Grid')} data-for='stream-viewmode-tip'
          >
            <Icon name='SmallGridView' styleName='grid-view-icon' />
          </div>
        </div>
        {makeDropdown(sortBy, customViewType === 'collection' ? COLLECTION_SORT_OPTIONS : STREAM_SORT_OPTIONS, changeSort)}
        {!['projects', 'proposals'].includes(view) && postTypeFilterDropdown}
        <Tooltip id='stream-viewmode-tip' position='bottom' />
      </div>
      {searchActive &&
        <div>
          <input
            autoFocus
            styleName='search-box'
            type='text'
            onChange={e => setSearchState(e.target.value)}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                setSearchState('')
                setSearchActive(false)
                changeSearch(e.target.value)
                e.target.blur()
              }
            }}
            placeholder={t('Search posts')}
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
