import cx from 'classnames'
import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import FeedBanner from 'components/FeedBanner'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import PostLabel from 'components/PostLabel'
import PostListRow from 'components/PostListRow'
import PostCard from 'components/PostCard'
import PostGridItem from 'components/PostGridItem'
import PostBigGridItem from 'components/PostBigGridItem'
import ScrollListener from 'components/ScrollListener'
import ViewControls from 'components/StreamViewControls'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import './Stream.scss'

const propHasChanged = (thisProps, prevProps) => sel => get(sel, thisProps) !== get(sel, prevProps)

const viewComponent = {
  cards: PostCard,
  list: PostListRow,
  grid: PostGridItem,
  bigGrid: PostBigGridItem
}

export default class Stream extends Component {
  static propTypes = {
    routeParams: PropTypes.object,
    selectedPostId: PropTypes.string,
    postTypeFilter: PropTypes.string,
    sortBy: PropTypes.string,
    viewMode: PropTypes.string,
    fetchPosts: PropTypes.func.isRequired,
    changeTab: PropTypes.func.isRequired,
    changeSort: PropTypes.func.isRequired,
    changeView: PropTypes.func.isRequired
  }

  componentDidMount () {
    this.fetchPosts(0)
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return

    const hasChanged = propHasChanged(this.props, prevProps)

    if (hasChanged('postTypeFilter') ||
      hasChanged('sortBy') ||
      hasChanged('context') ||
      hasChanged('group.id') ||
      hasChanged('view')) {
      this.fetchPosts(0)
    }
  }

  fetchPosts (offset) {
    const { pending, hasMore, fetchPosts } = this.props

    if (pending || hasMore === false) return

    fetchPosts(offset)
  }

  render () {
    const {
      customActivePostsOnly,
      changeSort,
      changeTab,
      changeView,
      context,
      currentUser,
      currentUserHasMemberships,
      customPostTypes,
      customViewTopics,
      group,
      newPost,
      routeParams,
      posts,
      postTypeFilter,
      pending,
      querystringParams,
      respondToEvent,
      selectedPostId,
      sortBy,
      viewMode
    } = this.props

    const ViewComponent = viewComponent[viewMode]
    const isCustomView = routeParams && routeParams.view === 'custom'

    return (
      <>
        <FeedBanner
          group={group}
          currentUser={currentUser}
          type={postTypeFilter}
          context={context}
          newPost={newPost}
          routeParams={routeParams}
          querystringParams={querystringParams}
          currentUserHasMemberships={currentUserHasMemberships}
        />
        {isCustomView ? (
          <div>
            Displaying all&nbsp;
            {customActivePostsOnly ? 'Active ' : ''}
            {customPostTypes.length === 0 ? 'None' : customPostTypes.map((p, i) => <PostLabel key={p} type={p} styleName='post-type' />)}
            {customViewTopics.length > 0 && <div>Filtered by topics: {customViewTopics.map(t => <span key={t.id}>#{t.name}</span>)}</div>}
          </div>)
          : <ViewControls
            routeParams={routeParams}
            postTypeFilter={postTypeFilter} sortBy={sortBy} viewMode={viewMode}
            changeTab={changeTab} changeSort={changeSort} changeView={changeView}
          />
        }
        <div styleName={cx('stream-items', { 'stream-grid': viewMode === 'grid', 'big-grid': viewMode === 'bigGrid' })}>
          {!pending && posts.length === 0 ? <NoPosts /> : ''}
          {posts.map(post => {
            const expanded = selectedPostId === post.id
            return (
              <ViewComponent
                styleName={cx({ 'card-item': viewMode === 'cards', expanded })}
                expanded={expanded}
                routeParams={routeParams}
                post={post}
                key={post.id}
                respondToEvent={respondToEvent}
              />
            )
          })}
        </div>
        <ScrollListener
          onBottom={() => this.fetchPosts(posts.length)}
          elementId={CENTER_COLUMN_ID}
        />
        {pending && <Loading />}
      </>
    )
  }
}
