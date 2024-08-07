import React from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import { TextHelpers } from 'hylo-shared'
import Highlight from 'components/Highlight'
import HyloHTML from 'components/HyloHTML'
import ClickCatcher from 'components/ClickCatcher'
import CardImageAttachments from 'components/CardImageAttachments'
import CardFileAttachments from 'components/CardFileAttachments'
import './CommentCard.scss'

export default function CommentCard ({
  comment,
  showDetails,
  expanded = true,
  highlightProps
}) {
  const { creator, post, slug, createdAt, editedAt, attachments } = comment
  const timestamp = (editedAt ? 'Edited ' : 'Commented ') + TextHelpers.humanDate(editedAt || createdAt)
  const postTitle = post.title ? TextHelpers.truncateText(post.title, 25) : TextHelpers.truncateHTML(post.details, 25)

  const commentText = expanded ? comment.text : TextHelpers.truncateHTML(comment.text, 144)
  const { t } = useTranslation()

  return (
    <span onClick={() => showDetails(comment.post.id)} styleName='link'>
      <div styleName={cx('comment-card', { expanded })}>
        <div styleName='comment-header'>
          <RoundImage url={creator.avatarUrl} styleName='profileImage' />
          <Highlight {...highlightProps}>
            <div styleName='comment-meta'>
              <span styleName='person-name'>{creator.name}</span> {t('commented on')}{' '}
              <span styleName='post-title'>{postTitle}</span>
            </div>
          </Highlight>
          <span styleName='date'>{timestamp}</span>
        </div>
        <CardImageAttachments attachments={attachments} linked styleName='comment-images' />
        <CardFileAttachments attachments={attachments} styleName='comment-files' />
        <ClickCatcher groupSlug={slug}>
          <Highlight {...highlightProps}>
            <HyloHTML styleName='comment-body' html={commentText} />
          </Highlight>
        </ClickCatcher>
        <div styleName='comment-footer' />
      </div>
    </span>
  )
}
