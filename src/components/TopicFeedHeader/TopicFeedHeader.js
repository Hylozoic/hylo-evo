import PropTypes from 'prop-types'
import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import Icon from 'components/Icon'
import { PostPrompt } from 'components/FeedBanner/FeedBanner'
import { pluralize, communityUrl, allCommunitiesUrl } from 'util/index'
import './TopicFeedHeader.scss'

const { string, number, object, shape, func } = PropTypes

export default function TopicFeedHeader ({
  topic,
  postsTotal,
  followersTotal,
  community,
  communityTopic,
  toggleSubscribe,
  currentUser,
  newPost
}) {
  const url = community ? communityUrl(community.slug) : allCommunitiesUrl()
  const name = community ? community.name : 'All Communities'
  postsTotal = postsTotal || 0
  followersTotal = followersTotal || 0
  return <div styleName='topic-feed-header'>
    <Link to={url} styleName='back'>
      <Icon name='Back' styleName='back-icon' /> back to {name}
    </Link>
    <div styleName='topic-name'>#{topic.name}</div>
    <div styleName='meta'>
      {pluralize(postsTotal, 'post')} • {pluralize(followersTotal, 'follower')}
    </div>
    {community && <Button styleName='subscribe' onClick={toggleSubscribe}>
      {communityTopic.isSubscribed ? 'Unsubscribe' : 'Subscribe'}
    </Button>}
    <PostPrompt currentUser={currentUser} newPost={() => newPost(topic.name)} styleName='post-prompt' />
  </div>
}
TopicFeedHeader.propTypes = {
  subscription: object,
  toggleSubscribe: func,
  topicName: string,
  postsTotal: number,
  followersTotal: number,
  topic: shape({
    id: string,
    name: string
  }).isRequired,
  community: shape({
    id: string,
    name: string,
    slug: string
  })
}
