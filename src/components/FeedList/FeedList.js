import React from 'react'
import TabBar from './TabBar'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import cx from 'classnames'
import './FeedList.scss'
import { isEmpty, some } from 'lodash/fp'
import { queryParamWhitelist } from 'store/reducers/queryResults'

const STICKY_TABBAR_ID = 'tabbar-sticky'

const tabbarOffset = 244

export default class FeedList extends React.Component {
  static defaultProps = {
    posts: []
  }

  constructor (props) {
    super(props)
    this.state = {
      atTabBar: false
    }
  }

  handleScrollEvents = event => {
    const { scrollTop } = event.target
    const { atTabBar } = this.state

    function setStickyPosition () {
      const tabbar = document.getElementById(STICKY_TABBAR_ID)
      if (tabbar) tabbar.style.top = (scrollTop - tabbarOffset) + 'px'
    }

    if (atTabBar && scrollTop < tabbarOffset) {
      this.setState({atTabBar: false})
    } else if (!atTabBar && scrollTop > tabbarOffset) {
      this.setState({atTabBar: true})
      setStickyPosition()
    }

    if (atTabBar) {
      setStickyPosition()
    }
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
      posts,
      showCommunities,
      editPost
    } = this.props
    const { atTabBar } = this.state

    return <div styleName='FeedList-container'>
      <ScrollListener
        elementId={CENTER_COLUMN_ID}
        onScroll={this.handleScrollEvents} />
      <div>
        <TabBar
          onChangeTab={changeTab}
          selectedTab={filter}
          onChangeSort={changeSort}
          selectedSort={sortBy} />
      </div>
      {atTabBar && <div id={STICKY_TABBAR_ID} styleName='tabbar-sticky'>
        <TabBar onChangeTab={changeTab}
          selectedTab={filter}
          onChangeSort={changeSort}
          selectedSort={sortBy} />
      </div>}
      <div styleName='FeedListItems'>
        {posts.map(post => {
          const expanded = post.id === selectedPostId
          return <PostCard
            post={post}
            showCommunity={showCommunities}
            styleName={cx('FeedListItem', {expanded})}
            expanded={expanded}
            showDetails={() => showPostDetails(post.id)}
            key={post.id}
            editPost={() => editPost(post.id)} />
        })}
      </div>
      <ScrollListener onBottom={() => this.fetchMorePosts()}
        elementId={CENTER_COLUMN_ID} />
    </div>
  }
}
