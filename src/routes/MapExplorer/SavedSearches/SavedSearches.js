import React, { useState } from 'react'

import { currentFilters, formatParams, paramPreview } from 'util/searchParams'
import Icon from 'components/Icon'
import { info } from 'util/assets'
import styles from './SavedSearches.scss'
import ReactTooltip from 'react-tooltip'

function SavedSearches (props) {
  let {
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
          <div styleName='searchBox'>
              <input
              type='text'
              onChange={e => setName(e.target.value)}
              placeholder='Name this view'
              value={name}
            />
            <span styleName={`save ${canSave ? '' :  'disabled'}`} onClick={canSave ? () => saveSearch(name) : undefined}>Save</span>
          </div>
          <div styleName='filters'><img src={info} />&nbsp;&nbsp;{currentFilters(filters)} </div>
        </div>
        
        <div styleName='savedViews'>
          <h2>Saved Views</h2>
          {searches.map((search, index) => {
            return (<SavedSearch key={index} search={search} deleteSearch={deleteSearch} viewSavedSearch={viewSavedSearch}/>)
          })}
        </div>
      </div>
    </div>
  )
}

const SavedSearch = ({ deleteSearch, viewSavedSearch, search }) => {
  const { name, count, context, community, network, postTypes, searchText, topics } = search;
  let { boundingBox } = search
  boundingBox[0] = { lat: parseFloat(boundingBox[0].lat), lng: parseFloat(boundingBox[0].lng) }
  boundingBox[1] = { lat: parseFloat(boundingBox[1].lat), lng: parseFloat(boundingBox[1].lng) }

  let mapPath, networkSlug, slug, subject
  switch (context) {
    case 'all': {
      mapPath = `/all/map`
      subject = 'all-communities'
      break
    }
    case 'public': {
      mapPath = `/public/map`
      subject = 'public-communities'
      break
    }
    case 'network': {
      mapPath = `/n/${network.slug}/map`
      subject = 'network'
      networkSlug = network.slug
      break
    }
    case 'community': {
      mapPath = `/c/${community.slug}/map`
      slug = community.slug
      subject = 'community'
      break
    }
    default: {
      mapPath = `/public/map`
      subject = 'public-communities'
    }
  }

  const featureTypes = postTypes.reduce((map, type) => {
    map[type] = true
    return map
  }, {})

  return (
    <div styleName='search'>
      <div styleName='row'>
        <div styleName='saved-name'>{name} {count && <span styleName='count'>{count}</span>} </div>
        <div styleName='actions'>
          <Icon name='Trash' styleName='delete' onClick={() => deleteSearch(search.id)}/>
          <div styleName='view' onClick={() => {
            viewSavedSearch({ subject, boundingBox, slug, networkSlug, search: searchText, featureTypes, topics }, mapPath)}
          }>View</div>
        </div>
      </div>
      <div styleName='row filters' data-tip={formatParams(search)} data-for='params'>
      <img src={info} /><span styleName='saved-filters'>
        <span>{paramPreview(search)}</span>
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

export default SavedSearches
