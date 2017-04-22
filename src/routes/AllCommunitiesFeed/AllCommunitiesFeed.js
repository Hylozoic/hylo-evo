import React from 'react'
import './AllCommunitiesFeed.scss'
import Feed from 'components/Feed'
import FeedBanner from 'components/FeedBanner'
import { pick } from 'lodash/fp'

export default function AllCommunitiesFeed (props) {
  const { currentUser } = props
  const feedProps = {
    subject: 'all-communities',
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
    <FeedBanner all currentUser={currentUser} />
    <Feed {...feedProps} />
  </div>
}
