import React from 'react'
import Pill from 'components/Pill'
import './EmojiPill.scss'

export default function EmojiPill ({ emojiFull, onClick = () => {}, count, userList }) {
  return (
    <Pill
      key={emojiFull}
      onClick={() => onClick(emojiFull)}
      styleName='tag-pill'
      darkText
      label={`${emojiFull} ${count}`}
      id={emojiFull}
    />
  )
}
