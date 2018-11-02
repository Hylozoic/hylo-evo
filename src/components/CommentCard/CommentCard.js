import React from 'react'
import cx from 'classnames'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { humanDate, present, sanitize } from 'hylo-utils/text'
import Highlight from 'components/Highlight'
import ClickCatcher from 'components/ClickCatcher'
import './CommentCard.scss'

export default function CommentCard ({
  comment,
  showDetails = () => {},
  shouldShowReply,
  expanded = true,
  highlightProps
}) {
  const { creator, post, slug, image } = comment
  const postTitle = present(sanitize(post.title), { maxlength: 25, noP: true, noLinks: true })
  const commentPresentOpts = {
    maxlength: expanded ? null : 144,
    noP: true,
    slug
  }
  const commentText = present(sanitize(comment.text), commentPresentOpts)

  return <a onClick={() => showDetails(comment.post.id)} styleName='link'>
    <div styleName={cx('comment-card', {expanded})}>
      <div styleName='comment-header'>
        <RoundImage url={creator.avatarUrl} large />
        <Highlight {...highlightProps}>
          <div styleName='comment-meta'>
            <span styleName='person-name'>{creator.name}</span> commented on&nbsp;
            <span styleName='post-title'>{postTitle}</span>
          </div>
        </Highlight>
        <span styleName='date'>{humanDate(comment.createdAt)}</span>
      </div>
      {image && <img src={image.url}
        onClick={() => window.open(image.url)}
        styleName='comment-image' />}
      {!image && <ClickCatcher>
        <Highlight {...highlightProps}>
          <div styleName='comment-body' dangerouslySetInnerHTML={{__html: commentText}} />
        </Highlight>
      </ClickCatcher>}
      <div styleName='comment-footer'>
        {shouldShowReply && <span><Icon styleName='reply-button' name='Reply' green /> Reply</span>}
      </div>
    </div>
  </a>
}
