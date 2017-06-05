import React from 'react'
import ReactDOM from 'react-dom'
import TabBar from './TabBar'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import { CENTER_COLUMN_ID, position } from 'util/scrolling'
import cx from 'classnames'
import './FeedList.scss'
import { throttle, isEmpty, some } from 'lodash/fp'
import { queryParamWhitelist } from 'store/reducers/queryResults'

export default class FeedList extends React.Component {
  static defaultProps = {
    posts: []
  }

  constructor (props) {
    super(props)
    this.state = {
      atTabBar: false,
      tabBarWidth: 0,
      scrollOffset: 0
    }
  }

  setStateFromDOM = tabBar => {
    const element = ReactDOM.findDOMNode(tabBar)
    const container = document.getElementById(CENTER_COLUMN_ID)
    if (!element || !container) return
    this.setState({
      tabBarWidth: element.offsetWidth,
      scrollOffset: position(element, container).y
    })
  }

  handleScrollEvents = throttle(100, event => {
    const { scrollTop } = event.target
    const { atTabBar, scrollOffset } = this.state
    if (atTabBar && scrollTop < scrollOffset) {
      this.setState({atTabBar: false})
    } else if (!atTabBar && scrollTop > scrollOffset) {
      this.setState({atTabBar: true})
    }
  })

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
      showCommunities
    } = this.props
    const { atTabBar, tabBarWidth } = this.state
    const style = {
      width: tabBarWidth + 'px'
    }

    return <div styleName='FeedList-container'>
      <ScrollListener
        elementId={CENTER_COLUMN_ID}
        onScroll={this.handleScrollEvents} />
      <div>
        <TabBar ref={this.setStateFromDOM}
          onChangeTab={changeTab}
          selectedTab={filter}
          onChangeSort={changeSort}
          selectedSort={sortBy} />
      </div>
      {atTabBar && <div styleName='tabbar-sticky' style={style}>
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
            key={post.id} />
        })}
      </div>
      <ScrollListener onBottom={() => this.fetchMorePosts()}
        elementId={CENTER_COLUMN_ID} />
    </div>
  }
}
