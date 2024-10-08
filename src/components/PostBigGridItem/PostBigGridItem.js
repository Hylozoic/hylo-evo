import React from 'react'
import Clamp from 'react-multiline-clamp'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import Tooltip from 'components/Tooltip'

import EventDate from 'components/PostCard/EventDate'
import EventRSVP from 'components/PostCard/EventRSVP'
import HyloHTML from 'components/HyloHTML'
import { personUrl } from 'util/navigation'
import Avatar from 'components/Avatar'
import EmojiRow from 'components/EmojiRow'
import Icon from 'components/Icon'
import './PostBigGridItem.scss'

export default function PostBigGridItem (props) {
  const {
    childPost,
    currentGroupId,
    routeParams,
    post,
    respondToEvent,
    showDetails,
    expanded,
    currentUser
  } = props
  const {
    title,
    details,
    creator,
    createdTimestamp,
    attachments
  } = post
  const { t } = useTranslation()

  const numAttachments = attachments.length || 0
  const firstAttachment = attachments[0] || 0
  // XXX: we should figure out what to actually do with 'video' type attachments, which are almost never used
  let attachmentType = (firstAttachment.type === 'video' ? 'file' : firstAttachment.type) || 0
  const attachmentUrl = firstAttachment.url || 0
  const isFlagged = post.flaggedGroups && post.flaggedGroups.includes(currentGroupId)

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
        {childPost &&
          <div
            styleName='icon-container'
            data-tip={t('Post from child group')}
            data-for='childgroup-tt'
          >
            <Icon
              name='Subgroup'
              styleName='icon'
            />
            <Tooltip
              delay={250}
              id='childgroup-tt'
            />
          </div>}
        {post.type === 'event' &&
          <div styleName='date' onClick={showDetailsTargeted}>
            <EventDate {...post} />
          </div>
        }
        <h3 styleName={cx('title', { isFlagged: isFlagged && !post.clickthrough })} onClick={showDetailsTargeted}>{title}</h3>
        {attachmentType === 'image'
          ? <div style={{ backgroundImage: `url(${attachmentUrl})` }} styleName={cx('first-image', { isFlagged: isFlagged && !post.clickthrough })} onClick={showDetails} />
          : ' '
        }
        {isFlagged && <Icon name='Flag' styleName='flagIcon' />}
        <HyloHTML styleName='details' html={details} onClick={showDetailsTargeted} />
        <div styleName='grid-meta'>
          <div styleName='grid-meta-row-1'>
            {post.type === 'event' &&
              <div styleName='date' onClick={showDetailsTargeted}>
                <EventDate {...post} />
              </div>}
            <h3 styleName='title' onClick={showDetails}>{title}</h3>
            <div styleName='content-snippet'>
              <Clamp lines={2}>
                <HyloHTML styleName='details' html={details} onClick={showDetailsTargeted} />
              </Clamp>
              <div styleName='fade' />
            </div>
            <div styleName='project-actions'>
              {post.donationsLink && donationService &&
                <div styleName='donate'>
                  <div><img src={`/assets/payment-services/${donationService}.svg`} /></div>
                  <div><a styleName='project-button' rel='noreferrer' href={post.donationsLink} target='_blank'>{t('Contribute')}</a></div>
                </div>}
              {post.donationsLink && !donationService &&
                <div styleName='donate'>
                  <div>{t('Support this project')}</div>
                  <div><a styleName='project-button' rel='noreferrer' href={post.donationsLink} target='_blank'>{t('Contribute')}</a></div>
                </div>}
              {attachmentType === 'file'
                ? <div styleName='file-attachment'>
                  {numAttachments > 1
                    ? <div styleName='attachment-number'>{numAttachments} {t('attachments')}</div>
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
                  <div>{t('Can you go?')}</div>
                  <EventRSVP {...post} respondToEvent={respondToEvent(post)} position='top' />
                </div>
              }
            </div>
            <div styleName='author' onClick={showDetails}>
              <div styleName='type-author'>
                <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
                {creator.name}
              </div>
              <div styleName='timestamp'>
                {createdTimestamp}
              </div>
            </div>
          </div>
          <div styleName='reactions'>
            <EmojiRow
              currentUser={currentUser}
              myReactions={post.myReactions}
              postReactions={post.postReactions}
              post={post}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
