import React from 'react'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import PostBodyProposal from '../PostBodyProposal'
import EmojiRow from 'components/EmojiRow'
import cx from 'classnames'
import './PostBody.scss'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { recordClickthrough } from 'store/actions/moderationActions'

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
        <div styleName='clickthrough-container'>
          <div>{t('clickthroughExplainer')}</div>
          <div styleName='clickthrough-button' onClick={() => dispatch(recordClickthrough({ postId: post.id }))}>{t('View post')}</div>
        </div>
      }
      <div styleName={cx('body', { smallMargin: !expanded }, { constrained }, { isFlagged: isFlagged && !post.clickthrough })} className={className}>

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
      {post.type === 'proposal' && <PostBodyProposal isFlagged={isFlagged && !post.clickthrough} {...post} currentUser={currentUser} />}
      <div styleName='reactions'>
        <EmojiRow
          post={post}
          currentUser={currentUser}
        />
      </div>
    </div>
  )
}
