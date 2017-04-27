import React from 'react'
import './CommunityFeed.scss'
import Feed from 'components/Feed'
import FeedBanner from 'components/FeedBanner'
import { get, pick } from 'lodash/fp'

export default function CommunityFeed (props) {
  const { community, currentUser } = props
  const feedProps = {
    subject: 'community',
    id: get('slug', community),
    ...pick([
      'filter',
      'sortBy',
      'changeSort',
      'changeTab',
      'showPostDetails',
      'selectedPostId'
    ], props)
  }

  return <div styleName='container'>
    <FeedBanner community={community} currentUser={currentUser} />
    <Feed {...feedProps} />
  </div>
}
