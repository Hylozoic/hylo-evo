import React from 'react'

import RoundImage from 'components/RoundImage'
import './CommentCard.scss'

export default function CommentCard ({ comment }) {
  const { creator } = comment
  return <div styleName='comment-card'>
    <RoundImage url={creator.avatarUrl} large />
    <span styleName='person-name'>{creator.name}</span> commented on  <span styleName='post-title'>{comment.post.title}</span>
  </div>
}
