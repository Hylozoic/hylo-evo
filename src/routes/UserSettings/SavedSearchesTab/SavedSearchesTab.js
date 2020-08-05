import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './SavedSearchesTab.scss'
import { formatParams } from 'util/searchParams'
import { info } from 'util/assets'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import ReactTooltip from 'react-tooltip'

const { array, func } = PropTypes

export default class SavedSearchesTab extends Component {
  static propTypes = {
    searches: array,
    deleteSearch: func
  }

  render () {
    const { searches, deleteSearch } = this.props
    if (!searches) return <Loading />

    return <div>
      <div styleName='title'>Saved Searches</div>
      {searches.map(s =>
        <SearchControl
          search={s}
          deleteSearch={deleteSearch}
          key={s.id} />)}
    </div>
  }
}

export function SearchControl ({ search, deleteSearch }) {
  const params = formatParams(search)

  return <div styleName='search-control'>
    <div styleName='row'>
      <Link to={'/all/map'} styleName='name'>{search.name}</Link>
      <span styleName='params-icon' data-tip={params} data-for='params'><img src={info} /></span>
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
