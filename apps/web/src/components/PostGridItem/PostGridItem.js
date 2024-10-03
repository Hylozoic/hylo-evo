import React from 'react'
import cx from 'classnames'
import Tooltip from 'components/Tooltip'
import { useTranslation } from 'react-i18next'
import { personUrl } from 'util/navigation'
import Avatar from 'components/Avatar'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import classes from './PostGridItem.module.scss'

export default function PostGridItem (props) {
  const {
    childPost,
    currentGroupId,
    routeParams,
    post,
    showDetails,
    expanded
  } = props
  const {
    title,
    details,
    creator,
    createdTimestampForGrid,
    attachments
  } = post

  const numAttachments = attachments.length || 0
  const firstAttachment = attachments[0] || 0
  const attachmentType = firstAttachment.type || 0
  const attachmentUrl = firstAttachment.url || 0
  if (!creator) { // PostCard guards against this, so it must be important? ;P
    return null
  }
  const { t } = useTranslation()
  const isFlagged = post.flaggedGroups && post.flaggedGroups.includes(currentGroupId)
  const creatorUrl = personUrl(creator.id, routeParams.slug)
  const unread = false
  // will reintegrate once I have attachment vars
  /* const startTimeMoment = Moment(post.startTime) */

  return (
    <div className={cx(classes.postGridItemContainer, { [classes.unread]: unread, [classes.expanded]: expanded }, classes[attachmentType])} onClick={showDetails}>
      <div className={classes.contentSummary}>
        {childPost &&
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
          </div>}
        <h3 className={cx(classes.title, { [classes.isFlagged]: isFlagged && !post.clickthrough })}>{title}</h3>
        {attachmentType === 'image'
          ? <div style={{ backgroundImage: `url(${attachmentUrl})` }} className={cx(classes.firstImage, { [classes.isFlagged]: isFlagged && !post.clickthrough })} />
          : attachmentType === 'file'
            ? <div className={classes.fileAttachment}>
              {numAttachments > 1
                ? <div className={classes.attachmentNumber}>{numAttachments} attachments</div>
                : ' '
              }
              <Icon name='Document' className={classes.fileIcon} />
              <div className={classes.attachmentName}>{attachmentUrl.substring(firstAttachment.url.lastIndexOf('/') + 1)}</div>
            </div>
            : ' '
        }
        {isFlagged && <Icon name='Flag' className={classes.flagIcon} />}

        <HyloHTML className={classes.details} html={details} />
        <div className={classes.gridMeta}>
          <div className={classes.gridMetaRow1}>
            <div className={classes.typeAuthor}>
              <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} className={classes.avatar} tiny />
              {creator.name}
            </div>
            <span className={classes.timestamp}>
              {createdTimestampForGrid}
            </span>
          </div>
        </div>
        <div className={classes.gridFade} />
      </div>
    </div>
  )
}
