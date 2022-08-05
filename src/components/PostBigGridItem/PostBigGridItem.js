import React from 'react'
import cx from 'classnames'
// import Moment from 'moment'
import { personUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import './PostBigGridItem.scss'

export default function PostBigGridItem (props) {
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
        {/*  Will fix this after I get attachment variables */}
        {/* {post.type === 'event' */
        /* ? <div styleName='date'> */
        /*   <span>{startTimeMoment.format('MMM')}</span> */
        /*   <span>{startTimeMoment.format('D')}</span> */
        /* </div> */
        /* : ' '} */}

        {/* TODO for tom:
          Retrieve attachments. If there are attachments print attachment[0] type. If attachment[0] is an image, print url

          From Tom: Now the attachment variables can be used to display the different views that you are keen for.
        */}
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

        <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} />
        <div styleName='grid-meta'>
          <h3 styleName='title'>{title}</h3>
          <div styleName='project-actions'>
            <div styleName='project-action'>
              Contribute on <img src='/assets/payment-services/paypal.svg' />
            </div>
          </div>
          <div styleName='author'>
            <div styleName='type-author'>
              <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
              {creator.name}
            </div>
            <div styleName='timestamp'>
              {TextHelpers.humanDate(createdAt)}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
