import React from 'react'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import Icon from 'components/Icon'
import { communityUrl } from 'util/index'
import './TopicFeedHeader.scss'

const { string, number, object, shape, func } = React.PropTypes

const pluralize = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

function TopicFeedHeader ({ subscription, topicName, postsTotal, followersTotal, topic, community, toggleTopicSubscribe }) {
  const url = community ? communityUrl(community.slug) : '/all'
  const name = community ? community.name : 'All Communities'
  const metaDefined = postsTotal && followersTotal ? true : null
  return <div styleName='topic-feed-header'>
    <Link to={url} styleName='back'><Icon name='Back' styleName='back-icon' /> back to {name}</Link>
    <div styleName='topic-name'>#{topicName}</div>
    {metaDefined && <div styleName='meta'>{pluralize(postsTotal, 'post')} &nbsp;•&nbsp; {pluralize(followersTotal, 'follower')}</div>}
    {community && <Button styleName='subscribe' onClick={toggleTopicSubscribe}>{subscription ? 'Unsubscribe' : 'Subscribe'}</Button>}
  </div>
}
TopicFeedHeader.propTypes = {
  subscription: object,
  toggleTopicSubscribe: func,
  topicName: string,
  postsTotal: number,
  followersTotal: number,
  topic: shape({
    id: string,
    name: string
  }),
  community: shape({
    id: string,
    name: string,
    slug: string
  })
}

export default TopicFeedHeader
