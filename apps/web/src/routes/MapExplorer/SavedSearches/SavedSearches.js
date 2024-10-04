import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Tooltip } from 'react-tooltip'
import { currentFilters, formatParams, formatParamPreview } from 'util/savedSearch'
import Icon from 'components/Icon'

import classes from './SavedSearches.module.scss'

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
    <div className={classes.container}>
      <span className={classes.triangle} style={triangleStyle}>&nbsp;</span>
      <div className={classes.innerContainer}>
        <div className={classes.title}>
          <span>
            <h2>{t('Save this view')}</h2>
            {t('Get updates about this map view')}</span>
          <Icon name='Ex' className={classes.close} onClick={toggle} />
        </div>

        <div className={classes.searchName}>
          <div className={classes.searchBox}>
            <input
              type='text'
              onChange={e => setName(e.target.value)}
              placeholder={t('Name this view')}
              value={name}
            />
            <span className={cx(classes.save, { [classes.disabled]: !canSave })} onClick={canSave ? () => saveSearch(name) : undefined}>{t('Save')}</span>
          </div>
          <div className={classes.filters}><Icon name='Info' className={classes.info} /><span className={classes.currentFilters}>{currentFilters(filters)}</span></div>
        </div>

        <div className={classes.savedViews}>
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
    <div className={classes.search}>
      <div className={classes.row}>
        <div className={classes.savedName}>{search.name} {search.count && <span className={classes.count}>{search.count}</span>} </div>
        <div className={classes.actions}>
          <Icon name='Trash' className={classes.delete} onClick={() => deleteSearch(search.id)} />
          <div className={classes.view} onClick={() => viewSavedSearch(search)}>{t('View')}</div>
        </div>
      </div>
      <div className={cx(classes.row, classes.filters)} data-tooltip-content={formatParams(search)} data-tooltip-id='params'>
        <Icon name='Info' className={classes.info} />
        <span className={classes.savedFilters}>
          <span>{formatParamPreview(search)}</span>
          <Tooltip
            place='right'
            id='params'
            effect='solid'
            multiline
            delayShow={200}
            className={classes.params}
          />
        </span>
      </div>
    </div>
  )
}
