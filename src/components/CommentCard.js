import React from 'react'

import RoundImage from 'components/RoundImage'
import './CommentCard.scss'

export default function CommentCard ({ comment }) {
  const { creator, post } = comment
  return <div styleName='comment-card'>
    <CommentHeader
      avatarUrl={creator.avatarUrl}
      personName={creator.name}
      postId={post.id}
      postTitle={post.title} />
  </div>
}

export function CommentHeader ({ avatarUrl, personName, postId, postTitle }) {
  return <div styleName='comment-header'>
    <RoundImage url={avatarUrl} large />
    <span styleName='person-name'>{personName}</span> commented on
    <span styleName='post-title'>{postTitle}</span>
  </div>
}
