import cx from 'classnames'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Icon from 'components/Icon'
import { formatParams, paramPreview } from 'util/searchParams'
import { info } from 'util/assets'
import styles from './SavedSearches.scss'
import ReactTooltip from 'react-tooltip'

function SavedSearches (props) {
  let {
    deleteSearch,
    filters,
    saveSearch,
    searches,
    toggle
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
            return (<SavedSearch key={index} search={search} deleteSearch={deleteSearch}/>)
          })}
        </div>
      </div>
    </div>
  )
}

const currentFilters = (filters) => {
  const { featureTypes, search, topics } = filters

  const postTypes = Object.keys(featureTypes).reduce((selected, type) => {
    if (featureTypes[type]) selected.push(type)
    return selected;
  }, [])

  const topicNames = topics.map(t => t.name)

  const parsedFilters = []
  
  if (postTypes.length) parsedFilters.push(`Post types: ${postTypes.join(', ')}`)
  if (topicNames.length) parsedFilters.push(`Topics: ${topicNames.join(' ,')}`)
  if (search.length) parsedFilters.push(`Search: ${search}`)

  return parsedFilters.length ? parsedFilters.join(' • ') : 'No filters'
}

const SavedSearch = ({ deleteSearch, search }) => {
  const { name, count } = search;
  const params = formatParams(search)
  //TODO: better parsing of params preview
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
