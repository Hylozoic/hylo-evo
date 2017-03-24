/* eslint-disable camelcase */
import React from 'react'
import PostCard from 'components/PostCard'
import { includes } from 'lodash/fp'
import styles from './component.scss' // eslint-disable-line no-unused-vars

const POST_TYPES = ['offer', 'request', 'discussion']

export default function FeedItem ({ feedItem, className }) {
  if (includes(feedItem.type, POST_TYPES)) {
    return <PostCard post={feedItem} className={className} />
  }

  return null
}
