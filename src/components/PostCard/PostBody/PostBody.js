import React from 'react'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import './PostBody.scss'
import cx from 'classnames'

export default function PostBody ({
  post,
  slug,
  expanded,
  className,
  highlightProps
}) {
  return <div styleName={cx('body', { smallMargin: !expanded })} className={className}>
    <PostTitle {...post} highlightProp={highlightProps} />
    <PostDetails {...post} slug={slug} highlightProp={highlightProps} expanded={expanded} />
  </div>
}
