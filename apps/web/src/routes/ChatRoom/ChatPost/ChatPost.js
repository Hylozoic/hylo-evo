import cx from 'classnames'
import { filter, isEmpty, isFunction, pick } from 'lodash/fp'
import moment from 'moment-timezone'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import ReactPlayer from 'react-player'
import { useLongPress } from 'use-long-press'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
import BadgeEmoji from 'components/BadgeEmoji'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import EmojiRow from 'components/EmojiRow'
import EmojiPicker from 'components/EmojiPicker'
import FlagContent from 'components/FlagContent'
import Highlight from 'components/Highlight'
import HyloEditor from 'components/HyloEditor'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import Feature from 'components/PostCard/Feature'
import LinkPreview from 'components/LinkPreview'
import RoundImageRow from 'components/RoundImageRow'
import useReactionActions from 'hooks/useReactionActions'
import deletePost from 'store/actions/deletePost'
import removePost from 'store/actions/removePost'
import { bgImageStyle } from 'util/index'
import isWebView from 'util/webView'
import { personUrl } from 'util/navigation'
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'
import getRolesForGroup from 'store/selectors/getRolesForGroup'
import { RESP_MANAGE_CONTENT } from 'store/constants'

import styles from './ChatPost.module.scss'

export default function ChatPost ({
  className,
  currentUser,
  group,
  highlightProps,
  intersectionObserver,
  post,
  showDetails,
  updatePost
}) {
  const {
    commenters,
    commentsTotal,
    createdAt,
    creator,
    details,
    editedAt,
    fileAttachments,
    groups,
    id,
    imageAttachments,
    linkPreview,
    linkPreviewFeatured,
    myReactions,
    postReactions
  } = post

  const dispatch = useDispatch()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const ref = useRef()
  const editorRef = useRef()
  const isPressDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const currentUserResponsibilities = useSelector(state => getResponsibilitiesForGroup(state, { person: currentUser, groupId: group.id })).map(r => r.title)

  const [editing, setEditing] = useState(false)
  const [isVideo, setIsVideo] = useState()
  const [flaggingVisible, setFlaggingVisible] = useState(false)
  const [isLongPress, setIsLongPress] = useState(false)

  const isCreator = currentUser.id === creator.id
  const creatorRoles = useSelector(state => getRolesForGroup(state, { person: creator, groupId: group.id }))

  const groupIds = groups.map(g => g.id)

  if (intersectionObserver) {
    useEffect(() => {
      intersectionObserver.observe(ref.current)
      return () => { intersectionObserver.disconnect() }
    })
  }

  useEffect(() => {
    if (linkPreview?.url) {
      setIsVideo(ReactPlayer.canPlay(linkPreview?.url))
    }
  }, [linkPreview?.url])

  const handleClick = event => {
    // Cancel long press if currently active
    if (isLongPress) {
      setIsLongPress(false)
    // Don't open post details in these cases
    } else if (
      !editing &&
      !(event.target.getAttribute('target') === '_blank') &&
      !event.target.className.includes(styles['imageInner']) &&
      !event.target.className.includes('icon-Smiley')
    ) {
      showPost()
    }
  }

  const bindLongPress = useLongPress(() => {
    setIsLongPress(false)
  }, {
    onFinish: () => {
      if (isPressDevice) setIsLongPress(true)
    }
  })

  const showPost = () => {
    showDetails(id)
    setIsLongPress(false)
  }

  const showCreator = event => {
    event.stopPropagation()
    navigate(personUrl(creator.id))
  }

  const editPost = event => {
    setEditing(true)
    setTimeout(() => {
      editorRef.current.focus('end')
    }, 500)
    event.stopPropagation()
    return true
  }

  const { reactOnEntity, removeReactOnEntity } = useReactionActions()
  const handleReaction = (emojiFull) => {
    reactOnEntity({ emojiFull, entityType: 'post', postId: id, groupIds })
    setIsLongPress(false)
  }
  const handleRemoveReaction = (emojiFull) => removeReactOnEntity({ emojiFull, entityType: 'post', postId: id })

  const handleEditCancel = () => {
    editorRef.current.setContent(details)
    setEditing(false)
    return true
  }

  const handleEditSave = contentHTML => {
    if (editorRef.current.isEmpty()) {
      // Do nothing and stop propagation
      return true
    }

    post.details = contentHTML
    post.topicNames = post.topics?.map((t) => t.name) // Make sure topic stays on the post
    updatePost(post)
    setEditing(false)

    // Tell Editor this keyboard event was handled and to end propagation.
    return true
  }

  const deletePostWithConfirm = useCallback((event) => {
    if (window.confirm('Are you sure you want to delete this post? You cannot undo this.')) {
      dispatch(deletePost(id, group.id))
    }
    event.stopPropagation()
    return true
  })

  const removePostWithConfirm = useCallback((event) => {
    if (window.confirm('Are you sure you want to remove this post? You cannot undo this.')) {
      dispatch(removePost(id, group.slug))
    }
    event.stopPropagation()
    return true
  })

  const actionItems = filter(item => isFunction(item.onClick), [
    // { icon: 'Pin', label: pinned ? 'Unpin' : 'Pin', onClick: pinPost },
    // { icon: 'Copy', label: 'Copy Link', onClick: copyLink },
    { icon: 'Replies', label: 'Reply', onClick: showPost },
    // TODO: Edit disabled in mobile environments due to issue with keyboard management and autofocus of field
    { icon: 'Edit', label: 'Edit', onClick: (isCreator && !isLongPress) ? editPost : null },
    { icon: 'Flag', label: 'Flag', onClick: !isCreator ? () => { setFlaggingVisible(true) } : null },
    { icon: 'Trash', label: 'Delete', onClick: isCreator ? deletePostWithConfirm : null, red: true },
    { icon: 'Trash', label: 'Remove From Group', onClick: !isCreator && currentUserResponsibilities.includes(RESP_MANAGE_CONTENT) ? removePostWithConfirm : null, red: true }
  ])

  const myEmojis = myReactions ? myReactions.map((reaction) => reaction.emojiFull) : []

  const commenterAvatarUrls = commenters.map(p => p.avatarUrl)

  return (
    <Highlight {...highlightProps}>
      <div
        className={cx(className, styles.container, { [styles.longPressed]: isLongPress })}
        ref={ref}
        {...bindLongPress()}
      >
        <div className={styles.actionBar}>
          {actionItems.map(item => (
            <Button
              key={item.label}
              noDefaultStyles
              borderRadius='0'
              onClick={item.onClick}
              className={styles.actionItem}
            >
              <Icon name={item.icon} />
            </Button>
          ))}
          <EmojiPicker
            className={styles.actionItem}
            handleReaction={handleReaction}
            handleRemoveReaction={handleRemoveReaction}
            myEmojis={myEmojis}
          />
          {flaggingVisible && (
            <FlagContent
              type='post'
              linkData={{ id, slug: group.slug, type: 'post' }}
              onClose={() => setFlaggingVisible(false)}
            />
          )}
        </div>

        {post.header && (
          <div className={styles.header} onClick={handleClick}>
            <div onClick={showCreator} className={styles.author}>
              <Avatar avatarUrl={creator.avatarUrl} className={styles.avatar} />
              <div className={styles.name}>{creator.name}</div>
              <div className={styles.badgeRow}>
                {creatorRoles.map(role => (
                  <BadgeEmoji key={role.id + role.common} expanded {...role} responsibilities={role.responsibilities} id={post.id} />
                ))}
              </div>
            </div>
            <div className={styles.date}>
              {moment(createdAt).format('h:mm a')}
              {editedAt && <span>&nbsp;({t('edited')} {moment(editedAt).format('h:mm a')})</span>}
            </div>
          </div>
        )}
        {details && editing && (
          <HyloEditor
            contentHTML={details}
            groupIds={groupIds}
            onEscape={handleEditCancel}
            onEnter={handleEditSave}
            placeholder='Edit Post'
            ref={editorRef}
            showMenu={!isWebView()}
            className={cx(styles.postContentContainer, styles.editing, styles.postContent)}
          />
        )}
        {details && !editing && (
          <ClickCatcher groupSlug={group.slug} onClick={handleClick}>
            <div className={styles.postContentContainer}>
              <HyloHTML className={styles.postContent} html={details} />
            </div>
          </ClickCatcher>
        )}
        {linkPreview?.url && linkPreviewFeatured && isVideo && (
          <Feature url={linkPreview.url} />
        )}
        {linkPreview && !linkPreviewFeatured && (
          <LinkPreview {...pick(['title', 'description', 'imageUrl', 'url'], linkPreview)} className={styles.linkPreview} />
        )}
        {!isEmpty(imageAttachments) && (
          <div className={styles.images} onClick={handleClick}>
            <div className={styles.imagesInner}>
              {imageAttachments.map(image =>
                <a href={image.url} className={styles.image} target='_blank' rel='noreferrer' key={image.url}>
                  <div className={styles.imageInner} style={bgImageStyle(image.url)} />
                </a>)}
            </div>
          </div>)}
        {!isEmpty(fileAttachments) && (
          <CardFileAttachments attachments={fileAttachments} />
        )}
        <EmojiRow
          className={cx(styles.emojis, { [styles.noEmojis]: !postReactions || postReactions.length === 0 })}
          post={post}
          currentUser={currentUser}
        />
        {commentsTotal > 0 && (
          <span className={styles.commentsContainer}>
            <RoundImageRow imageUrls={commenterAvatarUrls.slice(0, 3)} className={styles.commenters} onClick={handleClick} small />
            <span className={styles.commentsCaption} onClick={handleClick}>
              {commentsTotal} {commentsTotal === 1 ? 'reply' : 'replies'}
            </span>
          </span>
        )}
      </div>
    </Highlight>
  )
}
