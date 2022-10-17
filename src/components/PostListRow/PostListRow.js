import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import Moment from 'moment-timezone'
import { isEmpty } from 'lodash/fp'
import { personUrl, topicUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import Avatar from 'components/Avatar'
import HyloHTML from 'components/HyloHTML'
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
  const startTimeMoment = Moment(post.startTime)

  return (
    <div styleName={cx('post-row', { unread, expanded })} onClick={showDetails}>
      {/* <div styleName='votes'>
        <a
          onClick={(e) => { // TODO: all of this needs to be tweaked
            reactOnEntity(e)
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
      </div> */}
      <div styleName='content-summary'>
        <div styleName='type-author'>
          <div styleName={cx('post-type', post.type)}>{post.type}</div>
          <div styleName='participants'>
            {post.type === 'event' ? <div styleName='date'>
              <span>{startTimeMoment.format('MMM')}</span>
              <span>{startTimeMoment.format('D')}</span>
            </div> : <div>
              <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
              {creator.name} {
                numOtherCommentors > 1
                  ? (<span> and <strong>{numOtherCommentors} others</strong></span>)
                  : null
              }
            </div> }
          </div>
          <div styleName='timestamp'>
            {TextHelpers.humanDate(createdAt)}
          </div>
        </div>
        {!isEmpty(topics) && (
          <div styleName='topics'>
            {topics.slice(0, 3).map(t =>
              <Link styleName='topic' to={topicUrl(t.name, { groupSlug: routeParams.slug })} key={t.name} onClick={stopEvent}>#{t.name}</Link>)}
          </div>
        )}
        <h3 styleName='title'>{title}</h3>
        <HyloHTML styleName='details' html={details} />
      </div>
      <Tooltip
        delay={550}
        id={`post-tt-${post.id}`} />
    </div>
  )
}

export default PostListRow
