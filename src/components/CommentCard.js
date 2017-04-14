import React from 'react'

import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { humanDate } from 'hylo-utils/text'
import './CommentCard.scss'

export default function CommentCard ({ comment }) {
  const { creator, post } = comment
  return <div styleName='comment-card'>
    <div styleName='comment-header'>
      <RoundImage url={creator.avatarUrl} large />
      <div styleName='comment-meta'>
        <span styleName='person-name'>{creator.name}</span> commented on&nbsp;
        <span styleName='post-title'>{post.title}</span>
      </div>
      <span styleName='date'>{humanDate(comment.createdAt)}</span>
    </div>
    <div styleName='comment-body' dangerouslySetInnerHTML={{__html: comment.text}} />
    <div styleName='comment-footer'>
      <a href='' ><Icon styleName='reply-button' name='Reply' green /> Reply</a>
    </div>
  </div>
}
