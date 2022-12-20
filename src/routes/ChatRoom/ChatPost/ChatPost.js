import cx from 'classnames'
import { filter, isEmpty, isFunction, pick } from 'lodash/fp'
import moment from 'moment-timezone'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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
  expanded,
  forwardedRef,
  group,
  highlightProps,
  index,
  intersectionObserver,
  post,
  showDetails,
  updatePost
}) {
  const dispatch = useDispatch()
  const ref = useRef()
  const editorRef = useRef()

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
    id,
    imageAttachments,
    linkPreview,
    linkPreviewFeatured,
    myReactions,
    postReactions
  } = post

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

  const openPost = event => {
    // Don't open post details when long pressing, editing post, or clicking on link preview or other actionable things
    if (!isLongPress && !editing && !event.target.className.includes('icon-Smiley') && !event.target.className.includes('LinkPreview')) {
      showDetails(id)
    }
    setIsLongPress(false)
  }

  const editPost = event => {
    setEditing(true)
    setTimeout(() => {
      editorRef.current.focus('end')
    }, 200)
    event.stopPropagation()
    return true
  }

  const bindLongPress = useLongPress(() => {
    console.log('Long pressed!', id)
  }, {
    onFinish: event => setIsLongPress(true)
  })

  const { reactOnEntity, removeReactOnEntity } = useReactionActions()
  const handleReaction = (emojiFull) => reactOnEntity({ emojiFull, entityType: 'post', postId: id })
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
    { icon: 'Replies', label: 'Reply', onClick: openPost },
    { icon: 'Edit', label: 'Edit', onClick: isCreator ? editPost : null },
    { icon: 'Flag', label: 'Flag', onClick: !isCreator ? () => { setFlaggingVisible(true) } : null },
    { icon: 'Trash', label: 'Delete', onClick: isCreator ? deletePostWithConfirm : null, red: true },
    { icon: 'Trash', label: 'Remove From Group', onClick: !isCreator && canModerate ? removePostWithConfirm : null, red: true }
  ])
  const myEmojis = myReactions ? myReactions.map((reaction) => reaction.emojiFull) : []

  const commenterAvatarUrls = commenters.map(p => p.avatarUrl)

  return (
    <Highlight {...highlightProps}>
      <div styleName='container' ref={ref} onClick={openPost} className={className} {...bindLongPress()}>
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
          <EmojiPicker
            className={styles['action-item']}
            handleReaction={handleReaction}
            handleRemoveReaction={handleRemoveReaction}
            myEmojis={myEmojis}
          />
          {flaggingVisible && <FlagContent
            type='post'
            linkData={{ id, slug: group.slug, type: 'post' }}
            onClose={() => setFlaggingVisible(false)}
          />}
        </div>

        {post.header && (
          <>
            <div styleName='header'>
              <div styleName='author'>
                <Avatar url={personUrl(creator.id)} avatarUrl={creator.avatarUrl} className={styles.avatar} />
                <div styleName='name'>{creator.name}</div>
              </div>
              <div styleName='date'>{moment(createdAt).format('h:mm a')}</div>
            </div>
          </>
        )}
        {details && (
          <ClickCatcher groupSlug={group.slug}>
            {editing
              ? <HyloEditor
                contentHTML={details}
                groupIds={post.groups.map(g => g.id)}
                onEscape={handleEditCancel}
                onEnter={handleEditSave}
                placeholder='Edit Post'
                ref={editorRef}
                showMenu={!isWebView()}
                containerClassName={cx({ [styles.postContentContainer]: true, [styles.editing]: true })}
                styleName={cx({ postContent: true, editing })}
              />
              : <div styleName='postContentContainer'><HyloHTML styleName='postContent' html={details} /></div>
            }
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
