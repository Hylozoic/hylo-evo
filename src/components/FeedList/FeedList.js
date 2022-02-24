import React from 'react'
import { throttle, isEmpty, some } from 'lodash/fp'
import cx from 'classnames'
import { CENTER_COLUMN_ID, position } from 'util/scrolling'
import { queryParamWhitelist } from 'store/reducers/queryResults'
import TabBar from './TabBar'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import './FeedList.scss'

export default class FeedList extends React.Component {
  static defaultProps = {
    posts: [],
    routeParams: {}
  }

  constructor (props) {
    super(props)
    this.state = {
      atTabBar: false,
      tabBarWidth: 0,
      scrollOffset: 0
    }

    this.tabBar = React.createRef()
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return

    const updateCheckFunc = key =>
      this.props[key] !== prevProps[key] ||
      this.props.routeParams[key] !== prevProps.routeParams[key]
    if (some(key => updateCheckFunc(key), queryParamWhitelist) ||
      (this.props.posts.length === 0 && prevProps.posts.length !== 0)) {
      this.fetchOrShowCached()
    }

    if (this.props.width !== prevProps.width) {
      this.setStateFromDOM()
    }
  }

  setStateFromDOM = () => {
    const element = this.tabBar.current
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
      this.setState({ atTabBar: false })
    } else if (!atTabBar && scrollTop > scrollOffset) {
      this.setState({ atTabBar: true })
    }
  })

  fetchOrShowCached = () => {
    const { hasMore, posts, fetchPosts, storeFetchPostsParam } = this.props
    if (isEmpty(posts) && hasMore !== false) fetchPosts()
    storeFetchPostsParam()
  }

  fetchMorePosts = () => {
    const { pending, posts, hasMore, fetchPosts } = this.props
    if (pending || posts.length === 0 || !hasMore) return
    fetchPosts(posts.length)
  }

  render () {
    const {
      routeParams,
      postTypeFilter,
      collapsedState,
      sortBy,
      changeTab,
      changeSort,
      posts,
      pending,
      targetRef
    } = this.props
    const { atTabBar, tabBarWidth } = this.state
    const stickyTabBarStyle = {
      width: tabBarWidth + 'px'
    }
    const isProject = routeParams.view === 'projects'
    const isEvent = routeParams.view === 'events'
    const showSortAndFilters = !isProject && !isEvent

    return <div styleName='FeedList-container' ref={targetRef}>
      <ScrollListener
        elementId={CENTER_COLUMN_ID}
        onScroll={this.handleScrollEvents} />
      {showSortAndFilters && <React.Fragment>
        <div>
          <TabBar
            ref={this.tabBar}
            onChangeTab={changeTab}
            selectedTab={postTypeFilter}
            onChangeSort={changeSort}
            selectedSort={sortBy} />
        </div>
        {atTabBar && <div styleName='tabbar-sticky' style={stickyTabBarStyle}>
          <TabBar onChangeTab={changeTab}
            selectedTab={postTypeFilter}
            onChangeSort={changeSort}
            selectedSort={sortBy} />
        </div>}
      </React.Fragment>}
      <div styleName={cx('FeedListItems', { collapsedState })}>
        {!pending && posts.length === 0 ? <NoPosts message='Nothing to see here' /> : ''}

        {posts.map(post => {
          const expanded = post.id === routeParams.postId
          return <PostCard
            routeParams={routeParams}
            post={post}
            styleName={cx('FeedListItem', { expanded })}
            expanded={expanded}
            key={post.id} />
        })}
      </div>
      <ScrollListener onBottom={this.fetchMorePosts}
        elementId={CENTER_COLUMN_ID} />
      {pending && <Loading />}
    </div>
  }
}
