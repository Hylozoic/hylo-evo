import React, { useCallback, useEffect } from 'react'
import { push } from 'connected-react-router'
import { useDispatch, useSelector } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { fetchSavedSearches, deleteSearch as deleteSearchAction } from '../UserSettings.store'
import { FETCH_SAVED_SEARCHES } from 'store/constants'
import { formatParams, generateViewParams } from 'util/savedSearch'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import ReactTooltip from 'react-tooltip'
import './SavedSearchesTab.scss'

export default function SavedSearchesTab () {
  const dispatch = useDispatch()
  const viewSavedSearch = useCallback(search => {
    const { mapPath } = generateViewParams(search)
    dispatch(viewSavedSearch(search))
    dispatch(push(mapPath))
  })
  const deleteSearch = useCallback(searchId => dispatch(deleteSearchAction(searchId)))
  const currentUser = useSelector(getMe)
  const loading = useSelector(state => state.pending[FETCH_SAVED_SEARCHES])
  const searches = useSelector(state => state.SavedSearches.searches)

  useEffect(() => { dispatch(fetchSavedSearches(currentUser.id)) }, [])

  if (!searches || loading) return <Loading />

  return <div>
    <div styleName='title'>Saved Searches</div>
    {searches.map(s =>
      <SearchControl
        key={s.id}
        search={s}
        viewSavedSearch={viewSavedSearch}
        deleteSearch={deleteSearch}
      />
    )}
  </div>
}

export function SearchControl ({ search, deleteSearch, viewSavedSearch }) {
  return <div styleName='search-control'>
    <div styleName='row'>
      <span styleName='name' onClick={() => viewSavedSearch(search)}>{search.name}</span>
      <span data-tip={formatParams(search)} data-for='params'><Icon name='Info' styleName='params-icon' /></span>
      <ReactTooltip place='right'
        type='dark'
        id='params'
        effect='solid'
        multiline
        delayShow={200}
        className='params' />
      <span onClick={() => deleteSearch(search.id)} styleName='delete-button'>Delete</span>
    </div>
  </div>
}
