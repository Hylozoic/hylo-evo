import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './SavedSearchesTab.scss'
import { formatParams, generateViewParams } from 'util/searchParams'
import { info } from 'util/assets'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import ReactTooltip from 'react-tooltip'

const { array, func } = PropTypes

export default class SavedSearchesTab extends Component {
  static propTypes = {
    searches: array,
    deleteSearch: func,
    viewSavedSearch: func
  }

  render () {
    const { searches, deleteSearch, viewSavedSearch } = this.props
    if (!searches) return <Loading />

    return <div>
      <div styleName='title'>Saved Searches</div>
      {searches.map(s =>
        <SearchControl
          key={s.id}
          search={s}
          deleteSearch={deleteSearch}
          viewSavedSearch={viewSavedSearch}
        />)}
    </div>
  }
}

export function SearchControl ({ search, deleteSearch, viewSavedSearch }) {
  const { boundingBox, featureTypes, mapPath, networkSlug, searchText, slug, subject, topics } = generateViewParams(search)

  return <div styleName='search-control'>
    <div styleName='row'>
      <span styleName='name' onClick={() => {
        viewSavedSearch({ boundingBox, featureTypes, networkSlug, search: searchText, slug, subject, topics }, mapPath, search)}
      }>{search.name}</span>
      <span styleName='params-icon' data-tip={formatParams(search)} data-for='params'><img src={info} /></span>
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
