import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { get } from 'lodash/fp'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import ScrollListener from 'components/ScrollListener'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import PostListRow from 'components/PostListRow'
import './Stream.scss'

const propHasChanged = (thisProps, prevProps) => sel => get(sel, thisProps) !== get(sel, prevProps)

export default class Stream extends Component {
  static propTypes = {
    routeParams: PropTypes.object,
    selectedPostId: PropTypes.string,
    postTypeFilter: PropTypes.string,
    sortBy: PropTypes.string
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
      // postTypeFilter,
      // sortBy,
      // changeTab,
      // changeSort,
      posts,
      pending
    } = this.props

    return (
      <React.Fragment>
        <div styleName='stream-items'>
          {!pending && posts.length === 0 ? <NoPosts /> : ''}
          {posts.map(post => {
            return <PostListRow
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
