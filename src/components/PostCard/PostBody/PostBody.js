import cx from 'classnames'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import PostBodyProposal from '../PostBodyProposal'
import EmojiRow from 'components/EmojiRow'
import { recordClickthrough } from 'store/actions/moderationActions'

import classes from './PostBody.module.scss'

export default function PostBody (props) {
  const {
    slug,
    expanded,
    className,
    constrained,
    currentUser,
    highlightProps,
    isFlagged,
    onClick,
    ...post
  } = props
  const dispatch = useDispatch()
  const { t } = useTranslation()

  return (
    <div>
      {isFlagged && !post.clickthrough &&
        <div className={classes.clickthroughContainer}>
          <div>{t('clickthroughExplainer')}</div>
          <div className={classes.clickthroughButton} onClick={() => dispatch(recordClickthrough({ postId: post.id }))}>{t('View post')}</div>
        </div>}

      <div className={cx(classes.body, { [classes.smallMargin]: !expanded, [classes.constrained]: constrained, [classes.isFlagged]: isFlagged && !post.clickthrough }, className)}>
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
      {post.type === 'proposal' && <PostBodyProposal {...post} isFlagged={isFlagged && !post.clickthrough} currentUser={currentUser} />}
      <div className={classes.reactions}>
        <EmojiRow
          post={post}
          currentUser={currentUser}
        />
      </div>
    </div>
  )
}
