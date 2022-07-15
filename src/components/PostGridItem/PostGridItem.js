import React from 'react'
import cx from 'classnames'
// import Moment from 'moment'
import { personUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import Avatar from 'components/Avatar'
import './PostGridItem.scss'

export default function PostGridItem (props) {
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
    createdAt
  } = post

  if (!creator) { // PostCard guards against this, so it must be important? ;P
    return null
  }

  const creatorUrl = personUrl(creator.id, routeParams.slug)
  const unread = false
  // will reintegrate once I have attachment vars
  /* const startTimeMoment = Moment(post.startTime) */

  return (
    <div styleName={cx('post-grid-item-container', { unread, expanded })} onClick={showDetails}>
      <div styleName='content-summary'>
        <h3 styleName='title'>{title}</h3>

        {/*  Will fix this after I get attachment variables */}
        {/* {post.type === 'event' */
        /* ? <div styleName='date'> */
        /*   <span>{startTimeMoment.format('MMM')}</span> */
        /*   <span>{startTimeMoment.format('D')}</span> */
        /* </div> */
        /* : ' '} */}

        {/* TODO for tom:
        // Retrieve attachments. If there are attachments print attachment[0] type. If attachment[0] is an image, print url
        */}

        <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} />
        <div styleName='grid-meta'>
          <div styleName='type-author'>
            <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
            {creator.name}
          </div>
          <div styleName='timestamp'>
            {TextHelpers.humanDate(createdAt)}
          </div>
        </div>
        <div styleName='grid-fade' />
      </div>
    </div>
  )
}
