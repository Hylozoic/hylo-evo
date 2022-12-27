import React from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import Moment from 'moment-timezone'

import { isEmpty } from 'lodash/fp'
import { personUrl, topicUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import Avatar from 'components/Avatar'
import EmojiRow from 'components/EmojiRow'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import './PostListRow.scss'

// :SHONK: no idea why React propagates events from child elements but NOT IN OTHER COMPONENTS
const stopEvent = (e) => e.stopPropagation()

const PostListRow = (props) => {
  const {
    childPost,
    routeParams,
    post,
    showDetails,
    expanded,
    currentUser
  } = props
  const {
    title,
    details,
    creator,
    createdAt,
    commentersTotal,
    topics
  } = post

  if (!creator) { // PostCard guards against this, so it must be important? ;P
    return null
  }

  const typeLowercase = post.type.toLowerCase()
  const typeName = post.type.charAt(0).toUpperCase() + typeLowercase.slice(1)

  const creatorUrl = personUrl(creator.id, routeParams.slug)
  const numOtherCommentors = commentersTotal - 1
  const unread = false
  const startTimeMoment = Moment(post.startTime)
  const { t } = useTranslation()

  return (
    <div styleName={cx('post-row', { unread, expanded })} onClick={showDetails}>
      <div styleName='content-summary'>
        <div styleName='type-author'>
          <div styleName={cx('post-type', post.type)}>
            <Icon name={typeName} />
          </div>
          <div styleName='participants'>
            {post.type === 'event' ? <div styleName='date'>
              <span>{startTimeMoment.format('MMM')}</span>
              <span>{startTimeMoment.format('D')}</span>
            </div> : <div>
              <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' tiny />
              {creator.name} {
                numOtherCommentors > 1
                  ? (<span> and <strong>{numOtherCommentors} others</strong></span>) // TODO: Handle this translation
                  : null
              }
            </div> }
          </div>
          {childPost &&
            <div
              styleName='icon-container'
              data-tip={t('Post from child group')}
              data-for='childgroup-tt'
            >
              <Icon
                name='Subgroup'
                styleName='icon'
              />
              <Tooltip
                delay={250}
                id='childgroup-tt'
                position='bottom'
              />
            </div>}
          <div styleName={cx('timestamp', { 'push-to-right': !childPost })}>
            {TextHelpers.humanDate(createdAt)}
          </div>
        </div>
        {!isEmpty(topics) && (
          <div styleName='topics'>
            {topics.slice(0, 3).map(t =>
              <Link styleName='topic' to={topicUrl(t.name, { groupSlug: routeParams.slug })} key={t.name} onClick={stopEvent}>#{t.name}</Link>)}
          </div>
        )}
        <h3 styleName='title'>{title}</h3>
        <HyloHTML styleName='details' html={details} />
        <div styleName='reactions'>
          <EmojiRow
            post={post}
            currentUser={currentUser}
          />
        </div>
      </div>
      <Tooltip
        delay={550}
        id={`post-tt-${post.id}`}
      />
    </div>
  )
}

export default PostListRow
