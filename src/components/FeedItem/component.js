/* eslint-disable camelcase */
import React from 'react'
import PostCard from 'components/PostCard'
import './component.scss'

export default function FeedItem ({ feedItem, className }) {
  if (feedItem.type === 'post') {
    return <PostCard post={feedItem.post} className={className} />
  }
  return null
}
