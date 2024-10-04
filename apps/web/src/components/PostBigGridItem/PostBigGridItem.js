import cx from 'classnames'
import React from 'react'
import Clamp from 'react-multiline-clamp'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import Avatar from 'components/Avatar'
import EmojiRow from 'components/EmojiRow'
import EventDate from 'components/PostCard/EventDate'
import EventRSVP from 'components/PostCard/EventRSVP'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import { personUrl } from 'util/navigation'

import classes from './PostBigGridItem.module.scss'

export default function PostBigGridItem (props) {
  const {
    childPost,
    currentGroupId,
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
  const routeParams = useParams()

  const numAttachments = attachments.length || 0
  const firstAttachment = attachments[0] || 0
  // XXX: we should figure out what to actually do with 'video' type attachments, which are almost never used
  const attachmentType = (firstAttachment.type === 'video' ? 'file' : firstAttachment.type) || 0
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
    <div className={cx(classes.postGridItemContainer, { [classes.unread]: unread, [classes.expanded]: expanded }, classes[attachmentType], classes[detailClass], classes[post.type])} onClick={attachmentType !== 'image' && post.type !== 'event' ? showDetails : null}>
      <div className={classes.contentSummary}>
        {childPost && (
          <div
            className={classes.iconContainer}
            data-tooltip-content={t('Post from child group')}
            data-tooltip-id='childgroup-tt'
          >
            <Icon
              name='Subgroup'
              className={classes.icon}
            />
            <Tooltip
              delay={250}
              id='childgroup-tt'
            />
          </div>
        )}
        {post.type === 'event' && (
          <div className={classes.date} onClick={showDetailsTargeted}>
            <EventDate {...post} />
          </div>
        )}
        <h3 className={classes.title} onClick={showDetailsTargeted}>{title}</h3>

        {attachmentType === 'image'
          ? <div style={{ backgroundImage: `url(${attachmentUrl})` }} className={classes.firstImage} onClick={showDetails} />
          : null
        }
        {isFlagged && <Icon name='Flag' className={classes.flagIcon} />}
        <HyloHTML className={classes.details} html={details} onClick={showDetailsTargeted} />
        <div className={classes.gridMeta}>
          <div className={classes.gridMetaRow1}>
            {post.type === 'event' && (
              <div className={classes.date} onClick={showDetailsTargeted}>
                <EventDate {...post} />
              </div>
            )}
            <h3 className={classes.title} onClick={showDetails}>{title}</h3>
            <div className={classes.contentSnippet}>
              <Clamp lines={2}>
                <HyloHTML className={classes.details} html={details} onClick={showDetailsTargeted} />
              </Clamp>
              <div className={classes.fade} />
            </div>
            <div className={classes.projectActions}>
              {post.donationsLink && donationService && (
                <div className={classes.donate}>
                  <div><img src={`/assets/payment-services/${donationService}.svg`} alt={donationService} /></div>
                  <div><a className={classes.projectButton} rel='noreferrer' href={post.donationsLink} target='_blank'>{t('Contribute')}</a></div>
                </div>
              )}
              {post.donationsLink && !donationService && (
                <div className={classes.donate}>
                  <div>{t('Support this project')}</div>
                  <div><a className={classes.projectButton} rel='noreferrer' href={post.donationsLink} target='_blank'>{t('Contribute')}</a></div>
                </div>
              )}
              {attachmentType === 'file' && (
                <div className={classes.fileAttachment}>
                  {numAttachments > 1 ? (
                    <div className={classes.attachmentNumber}>{numAttachments} {t('attachments')}</div>
                  ) : null}
                  <div className={classes.attachment}>
                    <Icon name='Document' className={classes.fileIcon} />
                    <div className={classes.attachmentName}>{attachmentUrl.substring(firstAttachment.url.lastIndexOf('/') + 1)}</div>
                  </div>
                </div>
              )}
              {post.type === 'event' && (
                <div className={classes.eventResponse}>
                  <div>{t('Can you go?')}</div>
                  <EventRSVP {...post} respondToEvent={respondToEvent(post)} position='top' />
                </div>
              )}
            </div>
            <div className={classes.author} onClick={showDetails}>
              <div className={classes.typeAuthor}>
                <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} className={classes.avatar} tiny />
                {creator.name}
              </div>
              <div className={classes.timestamp}>
                {createdTimestamp}
              </div>
            </div>
          </div>
          <div className={classes.reactions}>
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
