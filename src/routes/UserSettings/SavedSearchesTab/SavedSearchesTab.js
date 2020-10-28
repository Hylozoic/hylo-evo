import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './SavedSearchesTab.scss'
import { formatParams } from 'util/savedSearch'
import Icon from 'components/Icon'
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
