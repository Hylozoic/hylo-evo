import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { currentFilters, formatParams, formatParamPreview } from 'util/savedSearch'
import Icon from 'components/Icon'
import './SavedSearches.scss'
import ReactTooltip from 'react-tooltip'

export default function SavedSearches (props) {
  const {
    deleteSearch,
    filters,
    saveSearch,
    searches,
    toggle,
    viewSavedSearch
  } = props

  const [name, setName] = useState('')
  const triangleStyle = { right: 100 }

  const canSave = name.length
  const { t } = useTranslation()

  return (
    <div styleName='container'>
      <span styleName='triangle' style={triangleStyle}>&nbsp;</span>
      <div styleName='innerContainer'>
        <div styleName='title'>
          <span>
            <h2>{t('Save this view')}</h2>
            {('Get updates about this map view')}</span>
          <Icon name='Ex' styleName='close' onClick={toggle} />
        </div>

        <div styleName='searchName'>
          <div styleName='searchBox'>
            <input
              type='text'
              onChange={e => setName(e.target.value)}
              placeholder='Name this view'
              value={name}
            />
            <span styleName={`save ${canSave ? '' : 'disabled'}`} onClick={canSave ? () => saveSearch(name) : undefined}>{t('Save')}</span>
          </div>
          <div styleName='filters'><Icon name='Info' styleName='info' /><span styleName='currentFilters'>{currentFilters(filters)}</span></div>
        </div>

        <div styleName='savedViews'>
          <h2>{t('Saved Views')}</h2>
          {searches.map((search, index) => {
            return (<SavedSearch key={index} search={search} deleteSearch={deleteSearch} viewSavedSearch={viewSavedSearch} />)
          })}
        </div>
      </div>
    </div>
  )
}

const SavedSearch = ({ deleteSearch, viewSavedSearch, search }) => {
  const { t } = useTranslation()
  return (
    <div styleName='search'>
      <div styleName='row'>
        <div styleName='saved-name'>{search.name} {search.count && <span styleName='count'>{search.count}</span>} </div>
        <div styleName='actions'>
          <Icon name='Trash' styleName='delete' onClick={() => deleteSearch(search.id)} />
          <div styleName='view' onClick={() => viewSavedSearch(search)}>{t('View')}</div>
        </div>
      </div>
      <div styleName='row filters' data-tip={formatParams(search)} data-for='params'>
        <Icon name='Info' styleName='info' />
        <span styleName='saved-filters'>
          <span>{formatParamPreview(search)}</span>
          <ReactTooltip
            place='right'
            id='params'
            effect='solid'
            multiline
            delayShow={200}
            styleName='params'
          />
        </span>
      </div>
    </div>
  )
}
