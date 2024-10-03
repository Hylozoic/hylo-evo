import cx from 'classnames'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import { CONTEXT_MY } from 'store/constants'
import { COLLECTION_SORT_OPTIONS, STREAM_SORT_OPTIONS } from 'util/constants'

import classes from './StreamViewControls.module.scss'

const makeDropdown = (selected, options, onChange, t) => {
  t('Proposals')
  t('Moderation')
  return (
    <Dropdown
      className={classes.dropdown}
      toggleChildren={
        <span className={classes.dropdownLabel}>
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
  let decisionViewDropdown
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

  const DECISIONS_OPTIONS = [
    { id: 'proposals', label: 'Proposals' },
    { id: 'moderation', label: 'Moderation' }
  ]

  const { customViewType, sortBy, postTypeFilter, viewMode, changeSearch, changeSort, changeTab, changeView, context, searchValue, view, customPostTypes, changeChildPostInclusion, childPostInclusion, decisionView, changeDecisionView } = props
  const [searchActive, setSearchActive] = useState(!!searchValue)
  const [searchState, setSearchState] = useState('')

  const postTypeOptionsForFilter = customPostTypes && customPostTypes.length > 1 ? POST_TYPE_OPTIONS.filter(postType => postType.label === 'All Posts' || customPostTypes.includes(postType.id)) : POST_TYPE_OPTIONS
  const postTypeFilterDropdown = makeDropdown(postTypeFilter, postTypeOptionsForFilter, changeTab, t)

  if (view === 'proposals') {
    decisionViewDropdown = makeDropdown(decisionView, DECISIONS_OPTIONS, changeDecisionView, t)
  }

  const handleSearchToggle = () => {
    setSearchActive(!searchActive)
  }
  const handleChildPostInclusion = () => {
    const updatedValue = childPostInclusion === 'yes' ? 'no' : 'yes'
    changeChildPostInclusion(updatedValue)
  }

  return (
    <div className={cx(classes.streamViewContainer, { [classes.searchActive]: searchActive || searchValue, [classes.extend]: searchActive && searchValue })}>
      <div className={classes.streamViewCtrls}>
        <div className={cx(classes.toggle, { [classes.active]: searchActive })} onClick={handleSearchToggle}>
          <Icon name='Search' className={cx(classes.toggleIcon, { [classes.active]: searchActive })} />
        </div>
        {![CONTEXT_MY, 'all', 'public'].includes(context) &&
          <div
            className={cx(classes.toggle, classes.marginRight, { [classes.active]: childPostInclusion === 'yes' })}
            onClick={handleChildPostInclusion}
            data-tooltip-content={childPostInclusion === 'yes' ? t('Hide posts from child groups you are a member of') : t('Show posts from child groups you are a member of')}
            data-tooltip-id='childgroup-toggle-tt'
          >
            <Icon name='Subgroup' className={cx(classes.toggleIcon, classes.subgroupIcon, { [classes.active]: childPostInclusion === 'yes' })} />
          </div>
        }
        <Tooltip
          delay={250}
          id='childgroup-toggle-tt'
          position='bottom'
        />
        <div className={classes.viewMode}>
          <div
            className={cx({ [classes.modeActive]: viewMode === 'cards' })}
            onClick={() => changeView('cards')}
            data-tooltip-content={t('Card view')} data-tooltip-id='stream-viewmode-tip'
          >
            <Icon name='CardView' />
          </div>

          <div
            className={cx({ [classes.modeActive]: viewMode === 'list' })}
            onClick={() => changeView('list')}
            data-tooltip-content={t('List view')} data-tooltip-id='stream-viewmode-tip'
          >
            <Icon name='ListView' />
          </div>

          <div
            className={cx({ [classes.modeActive]: viewMode === 'bigGrid' })}
            onClick={() => changeView('bigGrid')}
            data-tooltip-content={t('Large Grid')} data-tooltip-id='stream-viewmode-tip'
          >
            <Icon name='GridView' className={classes.gridViewIcon} />
          </div>

          <div
            className={cx({ [classes.modeActive]: viewMode === 'grid' }, classes.smallGrid)}
            onClick={() => changeView('grid')}
            data-tooltip-content={t('Small Grid')} data-tooltip-id='stream-viewmode-tip'
          >
            <Icon name='SmallGridView' className={classes.gridViewIcon} />
          </div>
        </div>
        {makeDropdown(sortBy, customViewType === 'collection' ? COLLECTION_SORT_OPTIONS : STREAM_SORT_OPTIONS, changeSort, t)}
        {!['projects', 'proposals'].includes(view) && postTypeFilterDropdown}
        {view === 'proposals' && decisionViewDropdown}
        <Tooltip id='stream-viewmode-tip' position='bottom' />
      </div>
      {searchActive &&
        <div>
          <input
            autoFocus
            className={classes.searchBox}
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
          className={classes.searchValue}
          onClick={() => changeSearch('')}
        >
          &quot;{searchValue}&quot;
          <Icon name='Ex' className={classes.textEx} />
        </div>}
    </div>
  )
}

export default StreamViewControls
