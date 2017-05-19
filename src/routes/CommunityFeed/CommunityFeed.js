import React from 'react'
import './CommunityFeed.scss'
import Feed from 'components/Feed'
import FeedBanner from 'components/FeedBanner'
import { get, pick } from 'lodash/fp'
import Loading from 'components/Loading'

export default function CommunityFeed (props) {
  const { community, currentUser } = props
  if (!community) return <Loading />

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
