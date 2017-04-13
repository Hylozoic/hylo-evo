import React from 'react'

import RoundImage from 'components/RoundImage'
import './CommentCard.scss'

export default function CommentCard ({ comment }) {
  const { creator } = comment
  return <div>
    <RoundImage url={creator.avatarUrl} large />
    {creator.name} commented on ... postname ...
  </div>
}
