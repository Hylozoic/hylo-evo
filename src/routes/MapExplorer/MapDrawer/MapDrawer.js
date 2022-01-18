import cx from 'classnames'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useLayoutFlags } from 'contexts/LayoutFlagsContext'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import Member from 'components/Member'
import PostCard from 'components/PostCard'
import { SORT_OPTIONS } from '../MapExplorer.store'
import styles from './MapDrawer.scss'

function MapDrawer (props) {
  let {
    currentUser,
    features,
    fetchParams,
    filters,
    onUpdateFilters,
    pending,
    routeParams,
    topics
  } = props

  const {
    sortBy
  } = filters

  const searchText = filters.search

  const { mobileSettingsLayout } = useLayoutFlags()
  const withoutNav = mobileSettingsLayout
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

  const featuresHTML = features.map(f => f.type === 'member'
    ? <Member
      canModerate={false}
      className={cx({ [styles.contentCard]: true, [styles.member]: true })}
      member={f}
      key={f.id}
      groupSlug={routeParams.groupSlug}
      context={fetchParams.context}
    />
    : <PostCard
      routeParams={routeParams}
      post={f}
      styleName='contentCard'
      constrained
      expanded={false}
      key={f.id}
    />
  )

  // Don't show topics we are already filtering by in searches
  const searchTopics = topics.filter(topic => !filters.topics.find(t => t.name === topic.name))

  return (
    <div styleName={cx('container', { noUser: !currentUser, withoutNav })}>
      <input
        styleName='searchBox'
        type='text'
        onChange={e => setSearch(e.target.value)}
        onFocus={e => setIsSearching(true)}
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
      <Icon name='Filter' className={styles.filterIcon} />

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
            &quot;{searchText}&quot; <Icon name='Ex' className={styles.textEx} />
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
              <span styleName='topicCount'>{topic.count}</span> #{topic.name} <Icon name='Ex' className={styles.filterEx} />
            </span>
          )
        })}
      </div>

      <h1>{features.length} result{features.length === 1 ? '' : 's'} in this area { pending && <Loading type='inline' styleName='loading' /> }</h1>
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
        {featuresHTML}
      </div>
    </div>
  )
}

MapDrawer.propTypes = {
  features: PropTypes.array,
  routeParams: PropTypes.object,
  onUpdateFilters: PropTypes.func
}

MapDrawer.defaultProps = {
  features: [],
  routeParams: {},
  onUpdateFilters: (opts) => { console.log('Updating filters with: ' + opts) }
}

export default MapDrawer
