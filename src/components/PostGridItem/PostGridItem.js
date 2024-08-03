import React from 'react'
import cx from 'classnames'
import Tooltip from 'components/Tooltip'
import { useTranslation } from 'react-i18next'
import { personUrl } from 'util/navigation'
import Avatar from 'components/Avatar'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import './PostGridItem.scss'

export default function PostGridItem (props) {
  const {
    childPost,
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
  const creatorUrl = personUrl(creator.id, routeParams.slug)
  const unread = false
  // will reintegrate once I have attachment vars
  /* const startTimeMoment = Moment(post.startTime) */

  return (
    <div styleName={cx('post-grid-item-container', { unread, expanded }, attachmentType)} onClick={showDetails}>
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
            <span styleName='timestamp'>
              {createdTimestampForGrid}
            </span>
          </div>
        </div>
        <div styleName='grid-fade' />
      </div>
    </div>
  )
}
