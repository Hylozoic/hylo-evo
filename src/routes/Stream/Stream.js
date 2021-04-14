import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cx from 'classnames'
import { get } from 'lodash/fp'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import ScrollListener from 'components/ScrollListener'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import ViewControls from 'components/StreamViewControls'
import PostListRow from 'components/PostListRow'
import PostCard from 'components/PostCard'
import './Stream.scss'

const propHasChanged = (thisProps, prevProps) => sel => get(sel, thisProps) !== get(sel, prevProps)

const viewComponent = {
  card: PostCard,
  list: PostListRow
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
      hasChanged('group.id')) {
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
      routeParams,
      selectedPostId,
      postTypeFilter,
      sortBy,
      viewMode,
      changeTab,
      changeSort,
      changeView,
      posts,
      pending
    } = this.props

    const ViewComponent = viewMode === 'cards' ? viewComponent['card'] : viewComponent['list']

    return (
      <React.Fragment>
        <ViewControls
          routeParams={routeParams}
          postTypeFilter={postTypeFilter} sortBy={sortBy} viewMode={viewMode}
          changeTab={changeTab} changeSort={changeSort} changeView={changeView}
        />
        <div styleName='stream-items'>
          {!pending && posts.length === 0 ? <NoPosts /> : ''}
          {posts.map(post => {
            const expanded = selectedPostId === post.id
            return <ViewComponent
              styleName={cx({ 'card-item': viewMode === 'cards', expanded })}
              expanded={expanded}
              routeParams={routeParams}
              post={post}
              key={post.id} />
          })}
        </div>
        <ScrollListener onBottom={() => this.fetchPosts(posts.length)}
          elementId={CENTER_COLUMN_ID} />
        {pending && <Loading />}
      </React.Fragment>
    )
  }
}
