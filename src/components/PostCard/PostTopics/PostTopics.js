import React from 'react'
import { Link } from 'react-router-dom'
import { tagUrl } from 'util/navigation'
import './PostTopics.scss'
import cx from 'classnames'

export default function PostTopics ({ topics, slug, spacer }) {
  const Spacer = spacer

  return <div styleName={cx('topicsLine', { 'newLineForTopics': !spacer })}>
    {spacer && <Spacer />}
    {topics.slice(0, 3).map(t =>
      <Link styleName='topic' to={tagUrl(t.name, slug)} key={t.name}>#{t.name}</Link>)}
  </div>
}
