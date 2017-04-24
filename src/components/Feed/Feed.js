import React from 'react'
import TabBar from './TabBar'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import cx from 'classnames'
import './Feed.scss'
import { isEmpty, some } from 'lodash/fp'
import { queryParamWhitelist } from 'store/reducers/queryResults'

export default class Feed extends React.Component {
  static defaultProps = {
    posts: []
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return
    if (some(key => this.props[key] !== prevProps[key], queryParamWhitelist)) {
      this.fetchOrShowCached()
    }
  }

  fetchOrShowCached () {
    const { hasMore, posts, fetchPosts } = this.props
    if (isEmpty(posts) && hasMore !== false) fetchPosts()
  }

  fetchMorePosts () {
    const { pending, posts, hasMore, fetchPosts } = this.props
    if (pending || posts.length === 0 || !hasMore) return
    fetchPosts(posts.length)
  }

  render () {
    const {
      filter,
      sortBy,
      showPostDetails,
      selectedPostId,
      changeTab,
      changeSort,
      posts
    } = this.props

    return <div>
      <TabBar onChangeTab={changeTab}
        selectedTab={filter}
        onChangeSort={changeSort}
        selectedSort={sortBy} />
      <div styleName='feedItems'>
        {posts.map(post => {
          const expanded = post.id === selectedPostId
          return <PostCard
            post={post}
            styleName={cx('feedItem', {expanded})}
            expanded={expanded}
            showDetails={() => showPostDetails(post.id)}
            key={post.id} />
        })}
      </div>
      <ScrollListener onBottom={() => this.fetchMorePosts()}
        elementId={CENTER_COLUMN_ID} />
    </div>
  }
}
