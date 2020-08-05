import cx from 'classnames'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import { formatParams } from 'util/searchParams'
import { info } from 'util/assets'
import styles from './SavedSearches.scss'
import ReactTooltip from 'react-tooltip'

function SavedSearches (props) {
  let {
    fetchPostsParam,
    filters,
    onUpdateFilters,
    features,
    querystringParams,
    routeParams,
    deleteSearch,
    searches,
    toggle
  } = props

  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [name, setName] = useState('')
  const triangleStyle = { right: 100 }

  return (
    <div styleName='container'>
      <span styleName='triangle' style={triangleStyle}>&nbsp;</span>
      <div styleName='innerContainer'>
        <div styleName='title'>
          <span>
          <h2>Save this view</h2>
          Get updates about this map view</span>
          <Icon name="Ex" styleName='close' onClick={toggle}/>
        </div>

        <div styleName='searchName'>
          <span styleName='searchBox'>
              <input
              type='text'
              onChange={e => setName(e.target.value)}
              // onFocus={e => setIsSearching(true)}
              // onKeyUp={e => {
              //   if (e.keyCode === 13) {
              //     setSearch('')
              //     setIsSearching(false)
              //     onUpdateFilters({ search: e.target.value })
              //     e.target.blur()
              //   }
              // }}
              placeholder='Name this view'
              value={name}
            />
            <span styleName='save'>Save</span>
          </span>
          <span styleName='filters'><img src={info} /> No filters</span>
       
        </div>
        
        
        <div styleName='savedViews'>
          <h2>Saved Views</h2>
          {searches.map((search, index) => {
            return (<SavedSearch key={index} search={search} deleteSearch={deleteSearch}/>)
          })}
        </div>
      </div>
    </div>
  )
}

const SavedSearch = ({ search, deleteSearch }) => {
  const { name, count, community, isPublic } = search;
  const params = formatParams(search)
  return (
    <div styleName='search'>
      <div styleName='row'>
        <div styleName='saved-name'>{name} {count && <span styleName='count'>{count}</span>} </div>
        <div styleName='actions'>
          <Icon name='Trash' styleName='delete' onClick={() => deleteSearch(search.id)}/>
          <div styleName='view'>View</div>
        </div>
      </div>
      <div styleName='row filters' data-tip={params} data-for='params'>
      <img src={info} /><span styleName='saved-filters'>Community: {community.name} • Public Posts: {isPublic ? 'Yes' : 'No'}
        <ReactTooltip place='right'
        id='params'
        effect='solid'
        multiline
        delayShow={200}
        styleName='params' />
        </span>
      </div>
    </div>
  )
}

SavedSearches.propTypes = {
  features: PropTypes.array,
  querystringParams: PropTypes.object,
  routeParams: PropTypes.object,
  onUpdateFilters: PropTypes.func
}

SavedSearches.defaultProps = {
  features: [],
  querystringParams: {},
  routeParams: {},
  onUpdateFilters: (opts) => { console.log('Updating filters with: ' + opts) }
}

export default SavedSearches
