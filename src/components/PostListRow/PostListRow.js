import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import { isEmpty } from 'lodash/fp'
import { personUrl, topicUrl } from 'util/navigation'
import { humanDate } from 'hylo-utils/text'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import './PostListRow.scss'

// :SHONK: no idea why React propagates events from child elements but NOT IN OTHER COMPONENTS
const stopEvent = (e) => e.stopPropagation()

const PostListRow = (props) => {
  const {
    routeParams,
    post,
    showDetails,
    voteOnPost,
    expanded
  } = props
  const {
    title,
    details,
    creator,
    createdAt,
    commentersTotal,
    votesTotal,
    myVote,
    topics
  } = post

  if (!creator) { // PostCard guards against this, so it must be important? ;P
    return null
  }

  const creatorUrl = personUrl(creator.id, routeParams.slug)
  const numOtherCommentors = commentersTotal - 1
  const unread = false

  return (
    <div styleName={cx('post-row', { unread, expanded })} onClick={showDetails}>
      <div styleName='votes'>
        <a
          onClick={(e) => {
            voteOnPost(e)
            stopEvent(e)
          }}
          styleName={cx('vote-button', { voted: myVote })}
          data-tip-disable={myVote}
          data-tip='Upvote this post so more people see it.'
          data-for={`post-tt-${post.id}`}
        >
          <Icon name='ArrowUp' styleName='vote-icon' />
          {votesTotal}
        </a>
      </div>
      <div styleName='content-summary'>
        <div styleName='participants'>
          <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
          {creator.name} {
            numOtherCommentors > 0
              ? (<span> and <strong>{numOtherCommentors}</strong></span>)
              : null
          }
        </div>
        <h3 styleName='title'>{title}</h3>
        <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} />
      </div>
      <div styleName='meta'>
        {!isEmpty(topics) && (
          <div styleName='topics'>
            {topics.slice(0, 3).map(t =>
              <Link styleName='topic' to={topicUrl(t.name, { groupSlug: routeParams.slug })} key={t.name} onClick={stopEvent}>#{t.name}</Link>)}
          </div>
        )}
        <div styleName='timestamp'>
          {humanDate(createdAt)}
        </div>
      </div>
      <Tooltip
        delay={550}
        id={`post-tt-${post.id}`} />
    </div>
  )
}

export default PostListRow
