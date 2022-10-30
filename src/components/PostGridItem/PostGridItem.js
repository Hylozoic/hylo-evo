import React from 'react'
import cx from 'classnames'
// import Moment from 'moment-timezone'
import { personUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import Avatar from 'components/Avatar'
import EmojiRow from 'components/EmojiRow'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import './PostGridItem.scss'

export default function PostGridItem (props) {
  const {
    routeParams,
    post,
    showDetails,
    expanded,
    currentUser
  } = props
  const {
    title,
    details,
    creator,
    createdAt,
    attachments
  } = post

  const numAttachments = attachments.length || 0
  const firstAttachment = attachments[0] || 0
  const attachmentType = firstAttachment.type || 0
  const attachmentUrl = firstAttachment.url || 0
  if (!creator) { // PostCard guards against this, so it must be important? ;P
    return null
  }

  const creatorUrl = personUrl(creator.id, routeParams.slug)
  const unread = false
  // will reintegrate once I have attachment vars
  /* const startTimeMoment = Moment(post.startTime) */

  return (
    <div styleName={cx('post-grid-item-container', { unread, expanded }, attachmentType)} onClick={showDetails}>
      <div styleName='content-summary'>
        <h3 styleName='title'>{title}</h3>
        {attachmentType === 'image'
          ? <div style={{ backgroundImage: `url(${attachmentUrl})` }} styleName='first-image' />
          : attachmentType === 'file'
            ? <div styleName='file-attachment'>
              {numAttachments > 1
                ? <div styleName='attachment-number'>{numAttachments} attachments</div>
                : ' '
              }
              <Icon name='Document' styleName='file-icon' />
              <div styleName='attachment-name'>{attachmentUrl.substring(firstAttachment.url.lastIndexOf('/') + 1)}</div>
            </div>
            : ' '
        }

        <HyloHTML styleName='details' html={details} />
        <div styleName='grid-meta'>
          <div styleName='grid-meta-row-1'>
            <div styleName='type-author'>
              <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
              {creator.name}
            </div>
            <div styleName='timestamp'>
              {TextHelpers.humanDate(createdAt)}
            </div>
          </div>
          <EmojiRow
            {...post}
            postId={post.id}
            currentUser={currentUser}
          />
        </div>
        <div styleName='grid-fade' />
      </div>
    </div>
  )
}
