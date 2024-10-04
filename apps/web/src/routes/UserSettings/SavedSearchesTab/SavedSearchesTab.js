import React, { useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Tooltip } from 'react-tooltip'
import isMobile from 'ismobilejs'
import cx from 'classnames'
import getMe from 'store/selectors/getMe'
import { fetchSavedSearches, deleteSearch as deleteSearchAction } from '../UserSettings.store'
import { FETCH_SAVED_SEARCHES } from 'store/constants'
import { formatParams, generateViewParams } from 'util/savedSearch'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import classes from './SavedSearchesTab.module.scss'

export default function SavedSearchesTab () {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const loading = useSelector(state => state.pending[FETCH_SAVED_SEARCHES])
  const searches = useSelector(state => state.SavedSearches.searches)

  const viewSavedSearch = useCallback(search => {
    const { mapPath } = generateViewParams(search)
    dispatch(viewSavedSearch(search))
    navigate(mapPath)
    return null
  })

  const deleteSearch = useCallback(searchId => dispatch(deleteSearchAction(searchId)))
  const { t } = useTranslation()

  useEffect(() => { dispatch(fetchSavedSearches(currentUser.id)) }, [])

  if (!searches || loading) return <Loading />

  return (
    <div>
      <div className={classes.title}>{t('Saved Searches')}</div>
      {searches.map(s =>
        <SearchControl
          key={s.id}
          search={s}
          viewSavedSearch={viewSavedSearch}
          deleteSearch={deleteSearch}
        />
      )}
    </div>
  )
}

export function SearchControl ({ search, deleteSearch, viewSavedSearch }) {
  const { t } = useTranslation()
  return (
    <div className={classes.searchControl}>
      <div className={classes.row}>
        <span className={classes.name} onClick={() => viewSavedSearch(search)}>{search.name}</span>
        <span data-tooltip-content={formatParams(search)} data-tooltip-id='params'>
          <Icon name='Info' className={classes.paramsIcon} />
        </span>
        {!isMobile.any && (
          <Tooltip
            place='right'
            type='dark'
            id='params'
            effect='solid'
            multiline
            delayShow={200}
            className='params'
          />
        )}
        <span onClick={() => deleteSearch(search.id)} className={classes.deleteButton}>{t('Delete')}</span>
      </div>
    </div>
  )
}
