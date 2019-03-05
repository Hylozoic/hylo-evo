import React from 'react'
import { decode } from 'ent'
import Highlight from 'components/Highlight'
import './PostTitle.scss'

export default function PostTitle ({
  title,
  highlightProps
}) {
  title = decode(title)
  return <Highlight {...highlightProps}>
    <div styleName='title' className='hdr-headline'>{title}</div>
  </Highlight>
}
