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

const stopEvent = (e) => e.stopPropagation()

export default function PostGridItem (props) {
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
  // const numOtherCommentors = commentersTotal - 1
  const unread = false
  const startTimeMoment = Moment(post.startTime)

  return (
    <div styleName={cx('post-grid-item-container', { unread, expanded })} onClick={showDetails}>
      <div styleName='content-summary'>
        <div styleName='type-author'>
          <div styleName={cx('post-type', post.type)}>{post.type}</div>
          <div styleName='participants'>
            {post.type === 'event' ? <div styleName='date'>
              <span>{startTimeMoment.format('MMM')}</span>
              <span>{startTimeMoment.format('D')}</span>
            </div> : <div>
              <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
              {creator.name} 
              {/* {
                numOtherCommentors > 1
                  ? (<span> and <strong>{numOtherCommentors} others</strong></span>)
                  : null
              } */}
            </div> }
          </div>

        </div>
        <h3 styleName='title'>{title}</h3>
        <div styleName='timestamp'>
          {TextHelpers.humanDate(createdAt)}
        </div>
        {/* <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} /> */}
      </div>
    </div>
  )
}
