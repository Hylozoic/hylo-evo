import React from 'react'
import Clamp from 'react-multiline-clamp'
import cx from 'classnames'
import EventDate from 'components/PostCard/EventDate'
import EventRSVP from 'components/PostCard/EventRSVP'
import { personUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import './PostBigGridItem.scss'

export default function PostBigGridItem (props) {
  const {
    routeParams,
    post,
    respondToEvent,
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

  const detailLength = details.length
  let detailClass = null

  detailLength < 75
    ? detailClass = 'detail-extra-short'
    : detailLength < 120
      ? detailClass = 'detail-short'
      : detailLength < 250
        ? detailClass = 'detail-mid'
        : detailLength < 400
          ? detailClass = 'detail-full'
          : detailClass = null

  if (!creator) { // PostCard guards against this, so it must be important? ;P
    return null
  }
  const creatorUrl = personUrl(creator.id, routeParams.slug)
  const unread = false

  const d = post.donationsLink ? post.donationsLink.match(/(cash|clover|gofundme|opencollective|paypal|squareup|venmo)/) : null
  const donationService = d ? d[1] : null

  const showDetailsTargeted = () => {
    return attachmentType === 'image' || post.type === 'event' ? showDetails() : null
  }

  return (
    <div styleName={cx('post-grid-item-container', { unread, expanded }, attachmentType, detailClass, post.type)} onClick={attachmentType !== 'image' && post.type !== 'event' ? showDetails : null}>
      <div styleName='content-summary'>
        {post.type === 'event' &&
          <div styleName='date' onClick={showDetailsTargeted}>
            <EventDate {...post} />
          </div>
        }
        <h3 styleName='title' onClick={showDetailsTargeted}>{title}</h3>

        {attachmentType === 'image'
          ? <div style={{ backgroundImage: `url(${attachmentUrl})` }} styleName='first-image' onClick={showDetails} />
          : ' '
        }

        <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} onClick={showDetailsTargeted} />
        <div styleName='grid-meta'>
          {post.type === 'event' &&
            <div styleName='date' onClick={showDetailsTargeted}>
              <EventDate {...post} />
            </div>
          }
          <h3 styleName='title' onClick={showDetails}>{title}</h3>
          <div styleName='content-snippet'>
            <Clamp lines={2}>
              <div styleName='details' dangerouslySetInnerHTML={{ __html: details }} onClick={showDetailsTargeted} />
            </Clamp>
            <div styleName='fade' />
          </div>
          <div styleName='project-actions'>
            {post.donationsLink && donationService &&
              <div styleName='donate'>
                <div><img src={`/assets/payment-services/${donationService}.svg`} /></div>
                <div><a styleName='project-button' href={post.donationsLink} target='_blank'>Contribute</a></div>
              </div>}
            {post.donationsLink && !donationService &&
              <div styleName='donate'>
                <div>Support this project</div>
                <div><a styleName='project-button' href={post.donationsLink} target='_blank'>Contribute</a></div>
              </div>}

            {attachmentType === 'file'
              ? <div styleName='file-attachment'>
                {numAttachments > 1
                  ? <div styleName='attachment-number'>{numAttachments} attachments</div>
                  : ' '
                }
                <div styleName='attachment'>
                  <Icon name='Document' styleName='file-icon' />
                  <div styleName='attachment-name'>{attachmentUrl.substring(firstAttachment.url.lastIndexOf('/') + 1)}</div>
                </div>
              </div>
              : ' '}

            {post.type === 'event' &&
              <div styleName='event-response'>
                <div>Can you go?</div>
                <EventRSVP {...post} respondToEvent={respondToEvent(post.id)} position='top' />
              </div>
            }
          </div>
          <div styleName='author' onClick={showDetails}>
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
