import React from 'react'
import { Link } from 'react-router-dom'

import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { postUrl } from 'util/index'
import { humanDate, present, sanitize } from 'hylo-utils/text'
import './CommentCard.scss'

export default function CommentCard ({ comment }) {
  const { creator, post, slug } = comment
  const postTitle = present(sanitize(post.title), { maxlength: 25, noP: true })
  const commentText = present(sanitize(comment.text), { noP: true, slug })
  return <Link to={postUrl(post.id, slug, {memberId: creator.id})}>
    <div styleName='comment-card'>
      <div styleName='comment-header'>
        <RoundImage url={creator.avatarUrl} large />
        <div styleName='comment-meta'>
          <span styleName='person-name'>{creator.name}</span> commented on&nbsp;
          <span styleName='post-title'>{postTitle}</span>
        </div>
        <span styleName='date'>{humanDate(comment.createdAt)}</span>
      </div>
      <div styleName='comment-body' dangerouslySetInnerHTML={{__html: commentText}} />
      <div styleName='comment-footer'>
        <Icon styleName='reply-button' name='Reply' green /> Reply
      </div>
    </div>
  </Link>
}
