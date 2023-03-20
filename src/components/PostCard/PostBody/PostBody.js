import React from 'react'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import EmojiRow from 'components/EmojiRow'
import cx from 'classnames'
import './PostBody.scss'

export default function PostBody (props) {
  const {
    slug,
    expanded,
    className,
    constrained,
    currentUser,
    highlightProps,
    onClick,
    ...post
  } = props

  return (
    <div>
      <div styleName={cx('body', { smallMargin: !expanded }, { constrained })} className={className}>
        {post.type !== 'chat' && <PostTitle
          {...post}
          highlightProp={highlightProps}
          constrained={constrained}
          onClick={onClick}
        />}

        <PostDetails
          {...post}
          slug={slug}
          highlightProp={highlightProps}
          expanded={expanded}
          constrained={constrained}
          onClick={onClick}
        />
      </div>
      <div styleName='reactions'>
        <EmojiRow
          post={post}
          currentUser={currentUser}
        />
      </div>
    </div>
  )
}
