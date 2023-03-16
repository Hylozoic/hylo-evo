import cx from 'classnames'
import React, { useState } from 'react'
import PropTypes from 'prop-types'
import isWebView from 'util/webView'
import Tooltip from 'components/Tooltip'

import { useLayoutFlags } from 'contexts/LayoutFlagsContext'
import Dropdown from 'components/Dropdown'
import { GroupCard } from 'components/Widget/GroupsWidget/GroupsWidget'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import Member from 'components/Member'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import { CONTEXT_MY } from 'store/constants'
import { STREAM_SORT_OPTIONS } from 'util/constants'

import styles from './MapDrawer.scss'

function MapDrawer (props) {
  const {
    changeChildPostInclusion,
    childPostInclusion,
    context,
    currentUser,
    fetchPostsForDrawer,
    filters,
    group,
    groups,
    locationParams,
    members,
    numFetchedPosts,
    numTotalPosts,
    onUpdateFilters,
    pendingPostsDrawer,
    posts,
    routeParams,
    topics
  } = props

  const {
    sortBy
  } = filters

  const searchText = filters.search

  const { hideNavLayout } = useLayoutFlags()
  const withoutNav = isWebView() || hideNavLayout
  const [search, setSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [currentTab, setCurrentTab] = useState('Posts')

  const filterByTopic = (topic) => {
    const newFilterTopics = filters.topics.concat(topic)
    onUpdateFilters({ topics: newFilterTopics })
  }

  const removeTopicFilter = (topic) => (e) => {
    const newFilterTopics = filters.topics.filter(t => t.name !== topic.name)
    onUpdateFilters({ topics: newFilterTopics })
  }

  // Don't show topics we are already filtering by in searches
  const searchTopics = topics.filter(topic => !filters.topics.find(t => t.name === topic.name))

  const tabs = { 'Posts': numTotalPosts, 'Groups': groups.length }
  if (context !== 'public') {
    tabs['Members'] = members.length
  }

  const handleChildPostInclusion = () => {
    const updatedValue = childPostInclusion === 'yes' ? 'no' : 'yes'
    changeChildPostInclusion(updatedValue)
  }

  return (
    <div styleName={cx('container', { noUser: !currentUser, withoutNav })} id='mapDrawerWrapper'>
      <div styleName='header'>
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
        <Icon name='Funnel' className={styles.filterIcon} />

        {isSearching
          ? <div styleName='searchFilters'>
            {searchTopics.slice(0, 10).map(topic => {
              return (
                <span
                  key={'choose_topic_' + topic.name}
                  onMouseDown={(e) => {
                    filterByTopic(topic)
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

        <TabBar currentTab={currentTab} tabs={tabs} selectTab={setCurrentTab} pendingPostsDrawer={pendingPostsDrawer} />
      </div>

      {currentTab === 'Posts' ? <div styleName='contentWrapper'>
        <div styleName='postsHeader'>
          {![CONTEXT_MY, 'all', 'public'].includes(context) &&
            <>
              <span onClick={handleChildPostInclusion}
                data-tip={childPostInclusion === 'yes' ? 'Hide posts from child groups' : 'Show posts from child groups'}
                data-for='childgroup-toggle-tt'
              >
                {/* TODO: i18n on tooltip */}
                <Icon
                  name='Subgroup'
                  className={cx(styles.toggleIcon, { [styles.activeToggle]: childPostInclusion === 'yes' })}
                />
              </span>
              <Tooltip
                delay={250}
                id='childgroup-toggle-tt'
                position='bottom'
              />
            </>}
          <span>Sort posts by:</span>
          <Dropdown styleName='sorter'
            toggleChildren={<span styleName='sorter-label'>
              {STREAM_SORT_OPTIONS.find(o => o.id === sortBy).label}
              <Icon name='ArrowDown' className={styles.sorterIcon} />
            </span>}
            items={STREAM_SORT_OPTIONS.map(({ id, label }) => ({
              label,
              onClick: () => onUpdateFilters({ sortBy: id })
            }))}
            alignRight
          />
        </div>

        <div styleName='contentListContainer' id='contentList'>
          {posts.map(p => <PostCard
            locationParams={locationParams}
            routeParams={routeParams}
            post={p}
            styleName='contentCard'
            constrained
            expanded={false}
            key={p.id}
          />)}
        </div>

        <ScrollListener onBottom={() => fetchPostsForDrawer(numFetchedPosts, false)} elementId='mapDrawerWrapper' />
      </div>
        : currentTab === 'Members' ? <div styleName='contentWrapper'>
          <div styleName='contentListContainer' id='contentList'>
            {members.map(m => <Member
              canModerate={false}
              className={cx({ [styles.contentCard]: true, [styles.member]: true })}
              member={m}
              key={m.id}
              group={group}
              context={context}
            />)}
          </div>
        </div>
          : currentTab === 'Groups' ? <div styleName='contentWrapper'>
            <div styleName='contentListContainer' id='contentList'>
              {groups.map(group => <GroupCard
                key={group.id}
                group={group}
                routeParams={routeParams}
                className={styles.groupCard}
              />)}
            </div>
          </div>
            : ''
      }
    </div>
  )
}

MapDrawer.propTypes = {
  groups: PropTypes.array,
  members: PropTypes.array,
  posts: PropTypes.array,
  routeParams: PropTypes.object,
  onUpdateFilters: PropTypes.func
}

MapDrawer.defaultProps = {
  groups: [],
  members: [],
  posts: [],
  routeParams: {},
  onUpdateFilters: (opts) => { console.log('Updating filters with: ' + opts) }
}

export default MapDrawer

export function TabBar ({ currentTab, tabs, selectTab, pendingPostsDrawer }) {
  return <ul styleName='tab-bar'>
    {Object.keys(tabs).map(name =>
      <li key={name}
        styleName={name === currentTab ? 'tab-active' : 'tab'}
        onClick={() => selectTab(name)}>
        {name}&nbsp;
        {(name !== 'Posts' || !pendingPostsDrawer) && <span styleName='tabCount'>{tabs[name]}</span>}
        {name === 'Posts' && pendingPostsDrawer && <Loading className={styles.loading} size={20} />}
      </li>)}
  </ul>
}
