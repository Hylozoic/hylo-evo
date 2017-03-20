import React from 'react'
import SAMPLE_FEED_ITEMS from './sampleData'
import FeedItem from 'components/FeedItem'

export default function Feed () {
  return <div styleName='feed'>
    {SAMPLE_FEED_ITEMS.map(feedItem => <FeedItem feedItem={feedItem} key={feedItem.id} />)}
  </div>
}
