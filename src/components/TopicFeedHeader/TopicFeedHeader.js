import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import { communityUrl } from 'util/index'
import './TopicFeedHeader.scss'

const { string, number, shape } = React.PropTypes

const pluralize = (count, word) => `${count} ${word}${count === 1 ? '' : 's'}`

function TopicFeedHeader ({ topicName, postsTotal, followersTotal, topic, community }) {
  const url = community ? communityUrl(community.slug) : '/all'
  const name = community ? community.name : 'All Communities'
  return <div styleName='topic-feed-header'>
    <Link to={url} styleName='back'><Icon name='Back' styleName='back-icon' /> back to {name}</Link>
    <div styleName='topic-name'>#{topicName}</div>
    {(postsTotal && followersTotal) && <div styleName='meta'>{pluralize(postsTotal, 'post')} &nbsp;•&nbsp; {pluralize(followersTotal, 'follower')}</div>}
  </div>
}
TopicFeedHeader.propTypes = {
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
