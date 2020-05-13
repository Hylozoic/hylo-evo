import React from 'react'
import Highlight from 'components/Highlight'
import './PostTitle.scss'

export default function PostTitle ({
  title,
  highlightProps
}) {
  return <Highlight {...highlightProps}>
    <div styleName='title' className='hdr-headline'>{title}</div>
  </Highlight>
}
