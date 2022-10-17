import { TextHelpers } from 'hylo-shared'
import { get, isEmpty, pick } from 'lodash/fp'
import React, { useEffect, useState } from 'react'
import ReactPlayer from 'react-player'
import Avatar from 'components/Avatar'
import EmojiRow from 'components/EmojiRow'
import Highlight from 'components/Highlight'
import HyloHTML from 'components/HyloHTML'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import Feature from 'components/PostCard/Feature'
import LinkPreview from 'components/LinkPreview'
import PeopleInfo from 'components/PostCard/PeopleInfo'
import RoundImageRow from 'components/RoundImageRow'
import { bgImageStyle } from 'util/index'
import { personUrl } from 'util/navigation'

import styles from './ChatPost.scss'

const MAX_DETAILS_LENGTH = 144

export default function ChatPost ({
  className,
  commenters,
  commentsTotal,
  createdAt,
  creator,
  currentUser,
  details: providedDetails,
  expanded,
  fileAttachments,
  forwardedRef,
  highlightProps,
  id,
  imageAttachments,
  isHeader,
  linkPreview,
  linkPreviewFeatured,
  myReactions,
  postReactions,
  showDetails,
  slug
}) {
  const [isVideo, setIsVideo] = useState()

  useEffect(() => {
    if (linkPreview?.url) {
      setIsVideo(ReactPlayer.canPlay(linkPreview?.url))
    }
  }, [linkPreview?.url])

  const details = expanded ? providedDetails : TextHelpers.truncateHTML(providedDetails, MAX_DETAILS_LENGTH)

  const openPost = event => {
    console.log("event", event, event.target, event.target.className)
    if (!event.target.className.includes("icon-Smiley")) {
      showDetails(id)
    }
  }

  const commenterAvatarUrls = commenters.map(p => p.avatarUrl)

  return (
    <Highlight {...highlightProps}>
      <div styleName='container' ref={forwardedRef} onClick={openPost} className={className}>
        {isHeader && (
          <>
            <Avatar url={personUrl(creator.id)} avatarUrl={creator.avatarUrl} className={styles.avatar} />
            <span styleName='name'>{creator.name}</span>
            <span styleName='date'>{TextHelpers.humanDate(createdAt)}</span>
          </>
        )}
        {details && (
          <ClickCatcher groupSlug={slug}>
            <HyloHTML styleName='details' html={details} />
          </ClickCatcher>
        )}
        {linkPreview?.url && linkPreviewFeatured && isVideo && (
          <Feature url={linkPreview.url} />
        )}
        {linkPreview && !linkPreviewFeatured && (
          <LinkPreview {...pick(['title', 'description', 'url', 'imageUrl'], linkPreview)} className={styles['link-preview']} />
        )}
        {!isEmpty(imageAttachments) && (
          <div styleName='images'>
            <div styleName='images-inner'>
              {imageAttachments.map(image =>
                <a href={image.url} styleName='image' target='_blank' rel='noreferrer' key={image.url}>
                  <div style={bgImageStyle(image.url)} />
                </a>)}
            </div>
          </div>)}
        {!isEmpty(fileAttachments) && (
          <CardFileAttachments attachments={fileAttachments} />
        )}
        {commentsTotal > 0 && (
          <span styleName='comments-container'>
            <RoundImageRow imageUrls={commenterAvatarUrls.slice(0, 3)} styleName='commenters' onClick={openPost} small />
            <span styleName='comments-caption' onClick={openPost}>
              {commentsTotal} {commentsTotal === 1 ? 'reply' : 'replies'}
            </span>
          </span>
        )}
        <EmojiRow
          className={styles.emojis}
          postReactions={postReactions}
          myReactions={myReactions}
          postId={id}
          currentUser={currentUser}
        />
      </div>
    </Highlight>
  )
}
