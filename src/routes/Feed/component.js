import React from 'react'
import CSSModules from 'react-css-modules'
import { SAMPLE_FEED_ITEMS, SAMPLE_COMMUNITY } from './sampleData'
import FeedItem from 'components/FeedItem'
import styles from './component.scss'
import { bgImageStyle } from 'util/index'

export default function Feed ({ feedItems, community }) {
  return <div styleName='feed'>
    <CommunityBanner community={community} />
    {SAMPLE_FEED_ITEMS.map(feedItem =>
      <FeedItem feedItem={feedItem} styleName='feedItem' key={feedItem.id} />)}
  </div>
}
Feed.defaultProps = {
  feedItems: SAMPLE_FEED_ITEMS,
  community: SAMPLE_COMMUNITY
}

export const CommunityBanner = CSSModules(({ community }) => {
  return <div styleName='banner'>
    <div style={bgImageStyle(community.bannerUrl)} styleName='image'>
      <div styleName='fade'><div styleName='fade2' /></div>
      {community.name}
    </div>
  </div>
}, styles)
