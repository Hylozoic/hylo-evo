import React from 'react'
import CSSModules from 'react-css-modules'
import { SAMPLE_FEED_ITEMS, SAMPLE_COMMUNITY } from './sampleData'
import FeedItem from 'components/FeedItem'
import RoundImage from 'components/RoundImage'
import TabBar from './TabBar'
import styles from './component.scss'
import { bgImageStyle } from 'util/index'

export default function Feed ({ feedItems, community, currentUser }) {
  return <div styleName='feed'>
    <CommunityBanner community={community} currentUser={currentUser} />
    <TabBar styleName='tabBar' />
    <div styleName='feedItems'>
      {SAMPLE_FEED_ITEMS.map(feedItem =>
        <FeedItem feedItem={feedItem} styleName='feedItem' key={feedItem.id} />)}
    </div>
  </div>
}
Feed.defaultProps = {
  feedItems: SAMPLE_FEED_ITEMS,
  community: SAMPLE_COMMUNITY
}

export const CommunityBanner = CSSModules(({ community, currentUser }) => {
  return <div styleName='banner'>
    <div style={bgImageStyle(community.bannerUrl)} styleName='image'>
      <div styleName='fade'><div styleName='fade2' /></div>
      <div styleName='header'>
        <div styleName='logo' style={bgImageStyle(community.avatarUrl)} />
        <div styleName='header-text'>
          <span styleName='header-name'>{community.name}</span>
          {community.location && <div styleName='header-location'>{community.location}</div>}
        </div>
      </div>
    </div>
    <PostPrompt currentUser={currentUser} />
  </div>
}, styles)

export const PostPrompt = CSSModules(({ currentUser }) => {
  if (!currentUser) return null
  return <div styleName='postPrompt' onClick={() => console.log('Open Post Form')}>
    <div styleName='shadow' />
    <RoundImage url={currentUser.avatarUrl} small styleName='prompt-image' />
    Hi {currentUser.name}, what's on your mind?
  </div>
}, styles)
