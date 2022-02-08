import React from 'react'
import cx from 'classnames'
import RoundImage from 'components/RoundImage'
import { TextHelpers } from 'hylo-shared'
import Highlight from 'components/Highlight'
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
  const { creator, post, slug, attachments } = comment
  const postTitle = TextHelpers.present(TextHelpers.sanitize(post.title), { maxlength: 25, noP: true, noLinks: true })
  const commentPresentOpts = {
    maxlength: expanded ? null : 144,
    noP: true,
    slug
  }
  const commentText = TextHelpers.present(TextHelpers.sanitize(comment.text), commentPresentOpts)

  return <span onClick={() => showDetails(comment.post.id)} styleName='link'>
    <div styleName={cx('comment-card', { expanded })}>
      <div styleName='comment-header'>
        <RoundImage url={creator.avatarUrl} styleName='profileImage' />
        <Highlight {...highlightProps}>
          <div styleName='comment-meta'>
            <span styleName='person-name'>{creator.name}</span> commented on&nbsp;
            <span styleName='post-title'>{postTitle}</span>
          </div>
        </Highlight>
        <span styleName='date'>{TextHelpers.humanDate(comment.createdAt)}</span>
      </div>
      <CardImageAttachments attachments={attachments} linked styleName='comment-images' />
      <CardFileAttachments attachments={attachments} styleName='comment-files' />
      <ClickCatcher>
        <Highlight {...highlightProps}>
          <div styleName='comment-body' dangerouslySetInnerHTML={{ __html: commentText }} />
        </Highlight>
      </ClickCatcher>
      <div styleName='comment-footer' />
    </div>
  </span>
}
