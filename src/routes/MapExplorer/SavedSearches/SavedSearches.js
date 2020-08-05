import cx from 'classnames'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Member from 'components/Member'
import PostCard from 'components/PostCard'
import { SORT_OPTIONS } from '../MapExplorer.store'
import styles from './SavedSearches.scss'
import { info } from 'util/assets'

const SEARCHES = [
  { name: 'Saved Search 1', count: 1, params: 'params' },
  { name: 'Saved Search 2', count: 3, params: 'params 2222' }
]

function SavedSearches (props) {
  let {
    fetchPostsParam,
    filters,
    onUpdateFilters,
    features,
    querystringParams,
    routeParams,
    saved = SEARCHES,
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
        
        
        <div styleName='saved'>
          <h2>Saved Views</h2>
          {saved.map((search, index) => {
            return (<SavedSearch key={index} search={search}/>)
          })}
        </div>
      </div>
    </div>
  )
}

const SavedSearch = ({ key, search }) => {
  const { name, count, params } = search;
  return (
    <div styleName='search'>
      <div styleName='row'>
        <span>{name} <span styleName='count'>{count}</span></span>
        <span styleName='actions'>
          <Icon name='Trash' styleName='delete' />
          <span styleName='view'>View</span>
        </span>
      </div>
      <div styleName='row filters'>
        <img src={info} /><span styleName='filters'>{params}</span>
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
