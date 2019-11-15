import React from 'react'
import { isEmpty } from 'lodash/fp'
import PostTitle from '../PostTitle'
import PostTopics from '../PostTopics'
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
    {!isEmpty(post.topics) && <PostTopics topics={post.topics} slug={slug} />}
    <PostDetails {...post} slug={slug} highlightProp={highlightProps} expanded={expanded} />
  </div>
}
