import React from 'react'

import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { humanDate, present, sanitize } from 'hylo-utils/text'
import './CommentCard.scss'

export default function CommentCard ({ comment }) {
  const { creator, post } = comment
  const postTitle = present(sanitize(post.title), { maxlength: 25, noP: true })
  console.log(postTitle)
  const commentText = present(sanitize(comment.text), { noP: true })
  console.log(commentText)
  return <div styleName='comment-card'>
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
      <a href='' ><Icon styleName='reply-button' name='Reply' green /> Reply</a>
    </div>
  </div>
}
