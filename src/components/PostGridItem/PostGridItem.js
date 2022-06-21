import React from 'react'
import { Link } from 'react-router-dom'
import cx from 'classnames'
import Moment from 'moment'
import { isEmpty } from 'lodash/fp'
import { personUrl, topicUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'

import './PostGridItem.scss'

const stopEvent = (e) => e.stopPropagation() // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT

export default function PostGridItem (props) {
  const {
    routeParams,
    post,
    showDetails,
    voteOnPost, // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT
    expanded
  } = props
  const {
    title,
    details, // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT
    creator,
    createdAt,
    commentersTotal, // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT
    votesTotal, // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT
    myVote, // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT
    topics // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT
  } = post

  if (!creator) { // PostCard guards against this, so it must be important? ;P
    return null
  }

  const creatorUrl = personUrl(creator.id, routeParams.slug)
  // const numOtherCommentors = commentersTotal - 1 // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT
  const unread = false
  const startTimeMoment = Moment(post.startTime)

  return (
    <div styleName={cx('post-grid-item-container', { unread, expanded })} onClick={showDetails}>
      {/* <div styleName='votes'>
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
      </div> */ /* TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT */}
      <div styleName='content-summary'>
        <div styleName='type-author'>
          <div styleName={cx('post-type', post.type)}>{post.type}</div>
          <div styleName='participants'>
            {post.type === 'event'
              ?
                <div styleName='date'>
                  <span>{startTimeMoment.format('MMM')}</span>
                  <span>{startTimeMoment.format('D')}</span>
                </div>
              : <div>
                <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
                {creator.name}
                {/* { // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT
                numOtherCommentors > 1
                  ? (<span> and <strong>{numOtherCommentors} others</strong></span>)
                  : null
              } */}
                </div>}
          </div>

        </div>
        {/* {!isEmpty(topics) && ( // TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT
          <div styleName='topics'>
            {topics.slice(0, 3).map(t =>
              <Link styleName='topic' to={topicUrl(t.name, { groupSlug: routeParams.slug })} key={t.name} onClick={stopEvent}>#{t.name}</Link>)}
          </div>
        )} */}
        <h3 styleName='title'>{title}</h3>
        <div styleName='timestamp'>
          {TextHelpers.humanDate(createdAt)}
        </div>
        {/* <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} /> */ /* TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT */}
        {/* <Tooltip
        delay={550}
        id={`post-tt-${post.id}`} /> */ /* TODO: CONFIRM WHETHER THIS CAN BE CUT OUT OR RESTYLED TO FIT */}
      </div>
    </div>
  )
}
