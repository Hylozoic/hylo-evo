import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import PostCard from 'components/PostCard'
import { SORT_OPTIONS } from '../MapExplorer.store'
import styles from './MapDrawer.scss'

function MapDrawer (props) {
  let {
    filters,
    onUpdateFilters,
    posts,
    querystringParams,
    routeParams,
    topics
  } = props

  const {
    sortBy
  } = filters

  const searchText = filters.search

  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const filterByTopic = (topic) => {
    const newFilterTopics = filters.topics.concat(topic)
    onUpdateFilters({ topics: newFilterTopics })
  }

  const removeTopicFilter = (topic) => (e) => {
    const newFilterTopics = filters.topics.filter(t => t.name !== topic.name)
    onUpdateFilters({ topics: newFilterTopics })
  }

  const postsHTML = posts.map(post =>
    <PostCard
      routeParams={routeParams}
      querystringParams={querystringParams}
      post={post}
      styleName='contentCard'
      constrained={'true'}
      expanded={false}
      key={post.id} />
  )

  // Don't show topics we are already filtering by in searches
  const searchTopics = topics.filter(topic => !filters.topics.find(t => t.name === topic.name))

  return (
    <div styleName='container'>
      <input
        styleName='searchBox'
        type='text'
        onChange={e => setSearch(e.target.value)}
        onFocus={e => setIsSearching(true)}
        onBlur={e => setIsSearching(false)}
        onKeyUp={e => {
          if (e.keyCode === 13) {
            setSearch('')
            setIsSearching(false)
            onUpdateFilters({ search: e.target.value })
            e.target.blur()
          }
        }}
        placeholder='Filter by topics and keywords'
        value={search}
      />
      { isSearching
        ? <div styleName='searchFilters'>
          {searchTopics.slice(0, 10).map(topic => {
            return (
              <span
                key={'choose_topic_' + topic.name}
                onClick={() => {
                  filterByTopic(topic)
                  setIsSearching(false)
                }}
                styleName='topicButton'
              >
                <span styleName='topicCount'>{topic.count}</span> {topic.name}
              </span>
            )
          })}
        </div>
        : ''
      }

      <div styleName='currentFilters'>
        {searchText
          ? <div
            styleName='currentSearchText'
            onClick={() => onUpdateFilters({ search: '' })}
          >
            &quot;{searchText}&quot; x
          </div>
          : ''
        }
        {filters.topics.map(topic => {
          return (
            <span
              key={'filter_topic_' + topic.name}
              onClick={removeTopicFilter(topic)}
              styleName='topicButton'
            >
              <span styleName='topicCount'>{topic.count}</span> #{topic.name} x
            </span>
          )
        })}
      </div>

      <h1>{posts.length} result{posts.length === 1 ? '' : 's'} in this area</h1>
      <Dropdown styleName='sorter'
        toggleChildren={<span styleName='sorter-label'>
          {SORT_OPTIONS.find(o => o.id === sortBy).label}
          <Icon name='ArrowDown' className={styles.sorterIcon} />
        </span>}
        items={SORT_OPTIONS.map(({ id, label }) => ({
          label,
          onClick: () => onUpdateFilters({ sortBy: id })
        }))}
        alignRight
      />

      <div styleName='contentListContainer'>
        {postsHTML}
      </div>
    </div>
  )
}

MapDrawer.propTypes = {
  posts: PropTypes.array,
  querystringParams: PropTypes.object,
  routeParams: PropTypes.object,
  onUpdateFilters: PropTypes.func
}

MapDrawer.defaultProps = {
  posts: [],
  querystringParams: {},
  routeParams: {},
  onUpdateFilters: (opts) => { console.log('Updating filters with: ' + opts) }
}

export default MapDrawer
