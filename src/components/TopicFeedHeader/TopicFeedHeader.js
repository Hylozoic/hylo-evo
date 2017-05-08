import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { communityUrl } from 'util/index'
import './TopicFeedHeader.scss'

const { string, number, shape } = React.PropTypes

const pluralize = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

function TopicFeedHeader ({ communityTopic, community }) {
  const { postsTotal, followersTotal, topic } = communityTopic
  return <div styleName='topic-feed-header'>
    <Link to={communityUrl(community.slug)} styleName='back'><Icon name='Back' styleName='back-icon' /> back to {community.name}</Link>
    <div styleName='topic-name'>#{topic.name}</div>
    <div styleName='meta'>{pluralize(postsTotal, 'post')} • {pluralize(followersTotal, 'follower')}</div>
  </div>
}
TopicFeedHeader.propTypes = {
  communityTopic: shape({
    postsTotal: number,
    followersTotal: number,
    topic: shape({
      id: string,
      name: string
    })
  }),
  community: shape({
    id: string,
    name: string,
    slug: string
  })
}

export default TopicFeedHeader
