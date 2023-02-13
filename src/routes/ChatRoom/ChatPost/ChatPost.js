import cx from 'classnames'
import { filter, isEmpty, isFunction, pick } from 'lodash/fp'
import moment from 'moment-timezone'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import ReactPlayer from 'react-player'
import { useLongPress } from 'use-long-press'
import Avatar from 'components/Avatar'
import Button from 'components/Button'
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
import styles from './ChatPost.scss'

export default function ChatPost ({
  canModerate,
  className,
  currentUser,
  group,
  highlightProps,
  intersectionObserver,
  post,
  showDetails,
  updatePost
}) {
  const dispatch = useDispatch()
  const history = useHistory()
  const ref = useRef()
  const editorRef = useRef()
  const isPressDevice = !window.matchMedia('(hover: hover) and (pointer: fine)').matches

  const [editing, setEditing] = useState(false)
  const [isVideo, setIsVideo] = useState()
  const [flaggingVisible, setFlaggingVisible] = useState(false)
  const [isLongPress, setIsLongPress] = useState(false)

  const {
    commenters,
    commentsTotal,
    createdAt,
    creator,
    details,
    fileAttachments,
    groups,
    id,
    imageAttachments,
    linkPreview,
    linkPreviewFeatured,
    myReactions,
    postReactions
  } = post

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
      !event.target.className.includes(styles['image-inner']) &&
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
    history.push(personUrl(creator.id))
  }

  const editPost = event => {
    setEditing(true)
    setTimeout(() => {
      editorRef.current.focus('end')
    }, 200)
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
    updatePost(post)
    setEditing(false)

    // Tell Editor this keyboard event was handled and to end propagation.
    return true
  }

  const isCreator = currentUser.id === creator.id

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
    { icon: 'Trash', label: 'Remove From Group', onClick: !isCreator && canModerate ? removePostWithConfirm : null, red: true }
  ])
  const myEmojis = myReactions ? myReactions.map((reaction) => reaction.emojiFull) : []

  const commenterAvatarUrls = commenters.map(p => p.avatarUrl)

  return (
    <Highlight {...highlightProps}>
      <div
        className={className}
        ref={ref}
        styleName={cx('container', { 'long-pressed': isLongPress })}
        {...bindLongPress()}
      >
        <div styleName='action-bar'>
          {actionItems.map(item => (
            <Button
              key={item.label}
              noDefaultStyles
              borderRadius='0'
              onClick={item.onClick}
              className={styles['action-item']}
            >
              <Icon name={item.icon} />
            </Button>
          ))}
          <EmojiPicker
            className={styles['action-item']}
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
          <div styleName='header' onClick={handleClick}>
            <div onClick={showCreator} styleName='author'>
              <Avatar avatarUrl={creator.avatarUrl} className={styles.avatar} />
              <div styleName='name'>{creator.name}</div>
            </div>
            <div styleName='date'>{moment(createdAt).format('h:mm a')}</div>
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
            containerClassName={cx({ [styles.postContentContainer]: true, [styles.editing]: true })}
            styleName={cx({ postContent: true, editing })}
          />
        )}
        {details && !editing && (
          <ClickCatcher groupSlug={group.slug} onClick={handleClick}>
            <div styleName='postContentContainer'>
              <HyloHTML styleName='postContent' html={details} />
            </div>
          </ClickCatcher>
        )}
        {linkPreview?.url && linkPreviewFeatured && isVideo && (
          <Feature url={linkPreview.url} />
        )}
        {linkPreview && !linkPreviewFeatured && (
          <LinkPreview {...pick(['title', 'description', 'imageUrl', 'url'], linkPreview)} className={styles['link-preview']} />
        )}
        {!isEmpty(imageAttachments) && (
          <div styleName='images' onClick={handleClick}>
            <div styleName='images-inner'>
              {imageAttachments.map(image =>
                <a href={image.url} styleName='image' target='_blank' rel='noreferrer' key={image.url}>
                  <div styleName='image-inner' style={bgImageStyle(image.url)} />
                </a>)}
            </div>
          </div>)}
        {!isEmpty(fileAttachments) && (
          <CardFileAttachments attachments={fileAttachments} />
        )}
        <EmojiRow
          className={cx({ [styles.emojis]: true, [styles.noEmojis]: !postReactions || postReactions.length === 0 })}
          post={post}
          currentUser={currentUser}
        />
        {commentsTotal > 0 && (
          <span styleName='comments-container'>
            <RoundImageRow imageUrls={commenterAvatarUrls.slice(0, 3)} styleName='commenters' onClick={handleClick} small />
            <span styleName='comments-caption' onClick={handleClick}>
              {commentsTotal} {commentsTotal === 1 ? 'reply' : 'replies'}
            </span>
          </span>
        )}
      </div>
    </Highlight>
  )
}
