import React from 'react'
import './Feed.scss'
import PostCard from 'components/PostCard'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import ScrollListener from 'components/ScrollListener'
import TabBar from './TabBar'
import { CENTER_COLUMN_ID } from 'util/scrolling'
import { bgImageStyle } from 'util/index'
import cx from 'classnames'
import { isEmpty, some } from 'lodash/fp'
import { queryParamWhitelist } from 'store/reducers/queryResults'

const whitelist = [...queryParamWhitelist, 'selectedTab']

export default class Feed extends React.Component {
  static defaultProps = {
    posts: [],
    selectedPostId: null
  }

  fetchOrShowCached () {
    const { hasMore, posts, fetchPosts } = this.props
    if (isEmpty(posts) && hasMore !== false) fetchPosts()
  }

  componentDidMount () {
    this.fetchOrShowCached()
  }

  componentDidUpdate (prevProps) {
    if (!prevProps) return
    if (some(key => this.props[key] !== prevProps[key], whitelist)) {
      this.fetchOrShowCached()
    }
  }

  fetchMorePosts () {
    const { pending, posts, hasMore, fetchPosts } = this.props
    if (pending || posts.length === 0 || !hasMore) return
    fetchPosts(posts.length)
  }

  render () {
    const {
      posts, community, currentUser, selectedPostId, changeTab, selectedTab
    } = this.props

    return <div styleName='feed'>
      <CommunityBanner community={community} currentUser={currentUser} />
      <TabBar onChangeTab={changeTab} selectedTab={selectedTab} />
      <div styleName='feedItems'>
        {posts.map(post => {
          const expanded = post.id === selectedPostId
          return <PostCard
            post={post}
            styleName={cx('feedItem', {expanded})}
            expanded={expanded}
            key={post.id} />
        })}
      </div>
      <ScrollListener onBottom={() => this.fetchMorePosts()}
        elementId={CENTER_COLUMN_ID} />
    </div>
  }
}

export const CommunityBanner = ({ community, currentUser }) => {
  if (!community) return null
  return <div styleName='banner'>
    <div style={bgImageStyle(community.bannerUrl)} styleName='image'>
      <div styleName='fade'><div styleName='fade2' /></div>
      <div styleName='header'>
        <div styleName='logo' style={bgImageStyle(community.avatarUrl)} />
        <div styleName='header-text'>
          <span styleName='header-name'>{community.name}</span>
          {community.location && <div styleName='header-location'>
            <Icon name='Location' styleName='header-icon' />
            {community.location}
          </div>}
        </div>
      </div>
    </div>
    <PostPrompt currentUser={currentUser} />
    <div styleName='shadow' />
  </div>
}

export const PostPrompt = ({ currentUser }) => {
  if (!currentUser) return null
  return <div styleName='postPrompt' onClick={() => console.log('Open Post Form')}>
    <RoundImage url={currentUser.avatarUrl} small styleName='prompt-image' />
    Hi {currentUser.firstName}, what's on your mind?
  </div>
}
