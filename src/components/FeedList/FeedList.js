import React from 'react'
import ReactDOM from 'react-dom'
import { throttle, isEmpty, some } from 'lodash/fp'
import cx from 'classnames'
import { CENTER_COLUMN_ID, position } from 'util/scrolling'
import { queryParamWhitelist } from 'store/reducers/queryResults'
import TabBar from './TabBar'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import Loading from 'components/Loading'
import './FeedList.scss'

export default class FeedList extends React.Component {
  static defaultProps = {
    posts: [],
    routeParams: {},
    querystringParams: {}
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
      this.setState({ atTabBar: false })
    } else if (!atTabBar && scrollTop > scrollOffset) {
      this.setState({ atTabBar: true })
    }
  })

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
  }

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
      querystringParams,
      postTypeFilter,
      sortBy,
      changeTab,
      changeSort,
      posts,
      pending
    } = this.props
    const { atTabBar, tabBarWidth } = this.state
    const style = {
      width: tabBarWidth + 'px'
    }
    const isProject = routeParams.postTypeContext === 'project'
    const isEvent = routeParams.postTypeContext === 'event'
    const showSortAndFilters = !isProject && !isEvent

    return <div styleName='FeedList-container'>
      <ScrollListener
        elementId={CENTER_COLUMN_ID}
        onScroll={this.handleScrollEvents} />
      {showSortAndFilters && <React.Fragment>
        <div>
          <TabBar ref={this.setStateFromDOM}
            onChangeTab={changeTab}
            selectedTab={postTypeFilter}
            onChangeSort={changeSort}
            selectedSort={sortBy} />
        </div>
        {atTabBar && <div styleName='tabbar-sticky' style={style}>
          <TabBar onChangeTab={changeTab}
            selectedTab={postTypeFilter}
            onChangeSort={changeSort}
            selectedSort={sortBy} />
        </div>}
      </React.Fragment>}
      <div styleName='FeedListItems'>
        {posts.map(post => {
          const expanded = post.id === routeParams.postId
          return <PostCard
            routeParams={routeParams}
            querystringParams={querystringParams}
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
