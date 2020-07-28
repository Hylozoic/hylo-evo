import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './SavedSearchesTab.scss'
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
  const { community, network, isPublic, searchText, postTypes } = search

  const params = [
    community ? `Community: ${community.slug}` : '',
    network ? `Network: ${network.slug}` : '',
    `Public posts: ${isPublic}`,
    searchText ? `Search term: ${searchText}` : '',
    postTypes ? `Post types: ${postTypes.join(', ')}` : ''
  ].filter(p => p.length).join('<br/>')

  return <div styleName='search-control'>
    <div styleName='row'>
      <Link to={'/all/map'} styleName='name'>{search.name}</Link>
      <span styleName='params-icon' data-tip={params} data-for='params'>?</span>
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
