import React from 'react'
import './Feed.scss'
import PostCard from 'components/PostCard'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import ScrollListener from 'components/ScrollListener'
import TabBar from './TabBar'
import { bgImageStyle } from 'util/index'

export default class Feed extends React.Component {
  static defaultProps = {
    posts: [],
    selectedPostId: null
  }

  componentDidMount () {
    this.props.fetchPosts(this.props.slug)
  }

  componentDidUpdate (prevProps) {
    if (this.props.slug === prevProps.slug) return
    if (this.props.posts.length === 0) {
      this.props.fetchPosts(this.props.slug)
    }
  }

  fetchMorePosts () {
    const { pending, posts, postCount } = this.props
    if (pending ||
      posts.length === 0 ||
      posts.length >= postCount) return

    this.props.fetchPosts(this.props.slug, {
      cursor: this.props.posts.slice(-1)[0].id
    })
  }

  render () {
    const { posts, community, currentUser, selectedPostId } = this.props

    return <div styleName='feed'>
      <CommunityBanner community={community} currentUser={currentUser} />
      <TabBar styleName='tabBar' />
      <div styleName='feedItems'>
        {posts.map(post =>
          <PostCard
            post={post}
            styleName='feedItem'
            expanded={post.id === selectedPostId}
            key={post.id} />)}
      </div>
      <ScrollListener onBottom={() => this.fetchMorePosts()} />
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
  </div>
}

export const PostPrompt = ({ currentUser }) => {
  if (!currentUser) return null
  return <div styleName='postPrompt' onClick={() => console.log('Open Post Form')}>
    <div styleName='shadow' />
    <RoundImage url={currentUser.avatarUrl} small styleName='prompt-image' />
    Hi {currentUser.firstName}, what's on your mind?
  </div>
}
