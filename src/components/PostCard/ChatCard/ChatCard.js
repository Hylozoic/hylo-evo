import cx from 'classnames'
import React from 'react'
import { TextHelpers } from 'hylo-shared'
import CardFileAttachments from 'components/CardFileAttachments'
import CardImageAttachments from 'components/CardImageAttachments'
import ClickCatcher from 'components/ClickCatcher'
import Highlight from 'components/Highlight'
import HyloHTML from 'components/HyloHTML'
import RoundImage from 'components/RoundImage'

import './ChatCard.scss'

export default function ChatCard ({
  expanded,
  highlightProps,
  post,
  showDetails,
  slug
}) {
  const firstTopic = post.topics[0]?.name
  const firstGroup = post.groups[0].name

  return (
    <span onClick={() => showDetails(post.id)} styleName='link'>
      <div styleName={cx('chat-card', { expanded })}>
        <div styleName='post-header'>
          <RoundImage url={post.creator.avatarUrl} styleName='profile-image' />
          <Highlight {...highlightProps}>
            <div styleName='post-meta'>
              <span styleName='person-name'>{post.creator.name}</span> chatted in&nbsp;
              <span styleName='post-topic'>#{firstTopic}</span>
              {!slug && <span>in&nbsp; <span styleName='group-name'>{firstGroup}</span></span>}
            </div>
          </Highlight>
          <span styleName='date'>{TextHelpers.humanDate(post.createdAt)}</span>
        </div>
        <CardImageAttachments attachments={post.attachments} linked styleName='post-images' />
        <CardFileAttachments attachments={post.attachments} styleName='post-files' />
        <ClickCatcher groupSlug={slug}>
          <Highlight {...highlightProps}>
            <HyloHTML styleName='post-body' html={post.details} />
          </Highlight>
        </ClickCatcher>
      </div>
    </span>
  )
}
