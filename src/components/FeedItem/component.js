/* eslint-disable camelcase */
import React from 'react'
import PostCard from 'components/PostCard'
import { includes } from 'lodash/fp'

const POST_TYPES = ['offer', 'request', 'discussion']

export default function FeedItem ({ feedItem, className }) {
  if (includes(feedItem.type, POST_TYPES)) {
    return <PostCard post={feedItem} className={className} />
  }

  return null
}
