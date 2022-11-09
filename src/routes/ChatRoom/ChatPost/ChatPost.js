import cx from 'classnames'
import { TextHelpers } from 'hylo-shared'
import { filter, get, isEmpty, isFunction, pick } from 'lodash/fp'
import React, { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import EmojiRow from 'components/EmojiRow'
import FlagContent from 'components/FlagContent'
import Highlight from 'components/Highlight'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import Feature from 'components/PostCard/Feature'
import LinkPreview from 'components/LinkPreview'
import PeopleInfo from 'components/PostCard/PeopleInfo'
import RoundImageRow from 'components/RoundImageRow'
import useReactionActions from 'hooks/useReactionActions'
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
  index,
  isHeader,
  linkPreview,
  linkPreviewFeatured,
  myReactions,
  onVisible,
  postReactions,
  showDetails,
  slug
}) {
  const ref = useRef()
  const [isVideo, setIsVideo] = useState()
  const [flaggingVisible, setFlaggingVisible] = useState(false)

  useEffect(() => {
    const observer = new window.IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        onVisible(id)
      }
    }, {
      root: ref.current.parentNode.parentNode,
      threshold: 0.7
    })

    observer.observe(ref.current)
    //console.log(ref.current.parentNode.parentNode.parentNode)
    return () => { observer.disconnect() }
  })

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

  const editPost = event => {
    console.log("edit event", event, event.target, event.target.className)
    if (!event.target.className.includes("icon-Smiley")) {
//      showDetails(id)
    }
  }

  const { reactOnEntity } = useReactionActions()
  const handleReaction = (emojiFull) => reactOnEntity({ emojiFull, entityType: 'post', entityId: id })

  const actionItems = filter(item => isFunction(item.onClick), [
      //{ icon: 'Pin', label: pinned ? 'Unpin' : 'Pin', onClick: pinPost },
      //{ icon: 'Copy', label: 'Copy Link', onClick: copyLink },
      { icon: 'Smiley', label: 'React', onClick: handleReaction },
      { icon: 'Reply', label: 'Reply', onClick: openPost },
      { icon: 'Edit', label: 'Edit', onClick: editPost },
      { icon: 'Flag', label: 'Flag', onClick: currentUser.id !== creator.id ? () => { setFlaggingVisible(true) } : null },
      // { icon: 'Trash', label: 'Delete', onClick: deletePost, red: true },
      // { icon: 'Trash', label: 'Remove From Group', onClick: removePost, red: true }
    ])

  const commenterAvatarUrls = commenters.map(p => p.avatarUrl)

  return (
    <Highlight {...highlightProps}>
      <div styleName='container' ref={ref} onClick={openPost} className={className}>
        <div styleName='action-bar'>
          {actionItems.map(item => (
            <Button
              key={item.label}
              noDefaultStyles
              borderRadius={'0'}
              onClick={item.onClick}
              className={styles['action-item']}
            >
              <Icon name={item.icon} />
            </Button>
          ))}
          {flaggingVisible && <FlagContent
            type='post'
            linkData={{ id, slug, type: 'post' }}
            onClose={() => setFlaggingVisible(false)}
          />}
        </div>

        {isHeader && (
          <>
            <div styleName='header'>
              <div styleName='author'>
                <Avatar url={personUrl(creator.id)} avatarUrl={creator.avatarUrl} className={styles.avatar} />
                <div styleName='name'>{creator.name}</div>
              </div>
              <div styleName='date'>{TextHelpers.humanDate(createdAt)}</div>
            </div>
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
        <EmojiRow
          className={cx({ [styles.emojis]: true, [styles.noEmojis]: !postReactions || postReactions.length === 0 })}
          postReactions={postReactions}
          myReactions={myReactions}
          postId={id}
          currentUser={currentUser}
        />
        {commentsTotal > 0 && (
          <span styleName='comments-container'>
            <RoundImageRow imageUrls={commenterAvatarUrls.slice(0, 3)} styleName='commenters' onClick={openPost} small />
            <span styleName='comments-caption' onClick={openPost}>
              {commentsTotal} {commentsTotal === 1 ? 'reply' : 'replies'}
            </span>
          </span>
        )}
      </div>
    </Highlight>
  )
}
