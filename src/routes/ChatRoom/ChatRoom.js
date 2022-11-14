import cx from 'classnames'
import { debounce, trim } from 'lodash/fp'
import moment from 'moment-timezone'
import { EditorView } from 'prosemirror-view'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import ReactResizeDetector from 'react-resize-detector'
import { Virtuoso } from 'react-virtuoso'
import AttachmentManager from 'components/AttachmentManager'
import Button from 'components/Button'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import LinkPreview from 'components/PostEditor/LinkPreview'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import PostCard from 'components/PostCard'
import TopicFeedHeader from 'components/TopicFeedHeader'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import { MAX_POST_TOPICS } from 'util/constants'
import ChatPost from './ChatPost'

import styles from './ChatRoom.scss'

// Hack to fix focusing on editor after it unmounts/remounts
EditorView.prototype.updateState = function updateState (state) {
  if (!this.docView) return // This prevents the matchesNode error on hot reloads
  this.updateStateInner(state, this.state.plugins !== state.plugins)
}

// the maximum amount of time in minutes that can pass between messages to still
// include them under the same avatar and timestamp
const MAX_MINS_TO_BATCH = 5

// Recommended here:
// https://github.com/ueberdosis/tiptap/issues/2403#issuecomment-1062712162
function useEventCallback (fn) {
  const ref = useRef()
  useLayoutEffect(() => {
    ref.current = fn
  })
  return useCallback(() => (0, ref.current)(), [])
}

export default function ChatRoom (props) {
  const {
    // changeSearch,
    addAttachment,
    clearImageAttachments,
    clearLinkPreview,
    createPost,
    canModerate,
    currentPostIndex,
    currentUser,
    // currentUserHasMemberships,
    fetchLinkPreviewPending,
    followersTotal,
    groupTopic,
    group,
    linkPreview,
    imageAttachments,
    routeParams,
    pending,
    postsFuture,
    postsPast,
    postsTotal,
    querystringParams,
    removeLinkPreview,
    respondToEvent,
    // search,
    selectedPostId,
    showDetails,
    topicLoading,
    topic,
    toggleGroupTopicSubscribe,
    updateGroupTopicLastReadPost,
    updatePost
  } = props

  const { topicName, groupSlug } = routeParams

  const emptyPost = useMemo(() => ({
    details: '',
    groups: group ? [group] : [],
    linkPreview,
    linkPreviewFeatured: false,
    location: '',
    title: null,
    topics: topic ? [topic] : [],
    type: 'chat'
  }), [group, topicName])

  const chatsRef = useRef()
  const editorRef = useRef()
  const virtuoso = useRef(null);

  const [atBottom, setAtBottom] = useState(false)
  const [postInProgress, setPostInProgress] = useState(false)
  const [lastReadPostId, setLastReadPostId] = useState(groupTopic?.lastReadPostId)
  const [newPost, setNewPost] = useState(emptyPost)
  const [firstItemIndex, setFirstItemIndex] = useState(false)
  const [createdNewPost, setCreatedNewPost] = useState(false)

  const fetchPostsPast = useCallback((offset) => {
    const { pending, hasMorePostsPast } = props
    if (pending || hasMorePostsPast === false) return
    props.fetchPostsPast(offset)
  }, [props.fetchPostsPast])

  const fetchPostsFuture = useCallback((offset) => {
    const { pending, hasMorePostsFuture } = props
    if (pending || hasMorePostsFuture === false) return
    props.fetchPostsFuture(offset)
  }, [props.fetchPostsFuture])

  useEffect(() => {
    // Make sure GroupTopic is loaded
    props.fetchTopic()
  }, [group?.id, topicName])

  useEffect(() => {
    // Wait until GroupTopic is loaded
    if (groupTopic?.id) {
      props.fetchPostsFuture(0)
      if (lastReadPostId) {
        props.fetchPostsPast(0)
      }
      // Reset everything
      setLastReadPostId(groupTopic.lastReadPostId)
      setFirstItemIndex(false)
      clearLinkPreview()
      clearImageAttachments()
    }
    setNewPost(emptyPost)
  }, [groupTopic?.id])

  // Do one time, to set ready
  useEffect(() => {
    if (postsPast !== null && postsFuture !== null) {
      setFirstItemIndex(postsTotal - postsPast.length - postsFuture.length)
      if (!lastReadPostId) {
        const lastPost = postsFuture.length > 0 ? postsFuture[postsFuture.length - 1] : postsPast[postsPast.length - 1]
        if (lastPost) {
          updateGroupTopicLastReadPost(groupTopic.id, lastPost.id)
          setLastReadPostId(lastPost.id)
        }
      }
    }
  }, [postsPast, postsFuture])

  useEffect(() => {
    if (atBottom && virtuoso.current) {
      setTimeout(() => {
        virtuoso.current.scrollToIndex(postsTotal)
      }, 300)
    }
  }, [postsTotal])

  useEffect(() => {
    if (editorRef.current) {
      setTimeout(() => {
        // In case we unmounted really quick and its no longer here
        if (editorRef.current) {
          editorRef.current.focus()
        }
      }, 600)
    }
  }, [editorRef?.current, groupTopic?.id])

  useEffect(() => {
    // On component unmount clear link preview and images attachments from redux
    return () => {
      clearLinkPreview()
      clearImageAttachments()
    }
  }, [])

  const handleDetailsUpdate = (d) => {
    const hasText = trim(editorRef.current?.getText() || '').length > 0
    setPostInProgress(hasText)
  }

  const handleAddTopic = topic => {
    if (newPost?.topics?.length >= MAX_POST_TOPICS) return
    setNewPost({ ...newPost, topics: [...newPost.topics, topic] })
  }

  // Checks for linkPreview every 1/2 second
  const handleAddLinkPreview = debounce(500, (url, force) => {
    const { linkPreview } = newPost
    if (linkPreview && !force) return
    props.pollingFetchLinkPreview(url)
  })

  useEffect(() => {
    setNewPost({ ...newPost, linkPreview })
  }, [linkPreview])

  const handleFeatureLinkPreview = featured => {
    setNewPost({ ...newPost, linkPreviewFeatured: featured })
  }

  const handleRemoveLinkPreview = () => {
    removeLinkPreview()
    setNewPost({ ...newPost, linkPreview: null, linkPreviewFeatured: false })
  }

  const handlePostVisible = (postId) => {
    if (lastReadPostId && postId > lastReadPostId) {
      setLastReadPostId(postId)
      updateGroupTopicLastReadPost(groupTopic.id, postId)
    }
  }

  const scrollToBottom = useCallback(() => {
    if (virtuoso.current) {
      console.log("scroll to botto", postsTotal)
      virtuoso.current.scrollToIndex(postsTotal)
    }
  }, [])

  const postChatMessage = useEventCallback(async () => {
    // Only submit if any non-whitespace text has been added
    if (trim(editorRef.current?.getText() || '').length === 0) return

    const details = editorRef.current.getHTML()
    const imageUrls = imageAttachments && imageAttachments.map((attachment) => attachment.url)
    const topicNames = newPost.topics?.map((t) => t.name)
    await createPost({ ...newPost, details, imageUrls, topicNames })
    setNewPost(emptyPost)
    setCreatedNewPost(true)
    editorRef.current.clearContent()
    editorRef.current.focus()
    clearImageAttachments()
    clearLinkPreview()
    scrollToBottom()
    return true
  })

  const postsForDisplay = useMemo(() => {
    let currentHeader, lastPost, currentDay, newDay
    if (!postsPast || !postsFuture) return []
    return postsPast.concat(postsFuture).reduce((acc, post, i) => {
      let headerDate, messageDate, diff, greaterThanMax
      if (!currentHeader) {
        post.header = true
        currentHeader = post
      } else {
        headerDate = new Date(currentHeader.createdAt)
        messageDate = new Date(post.createdAt)
        diff = Math.abs(headerDate - messageDate)
        greaterThanMax = Math.floor(diff / 60000) > MAX_MINS_TO_BATCH
        post.header = greaterThanMax || post.creator.id !== currentHeader.creator.id || lastPost.commentersTotal > 0
        currentHeader = post.header ? post : currentHeader
      }

      // Is this a new day, then display it as a header
      newDay = moment(post.createdAt).format('DD MMMM, YYYY')
      if (!currentDay || currentDay !== newDay) {
        currentDay = newDay
        // Ensure the date is displayed with today and yesterday
        post.displayDay = moment(post.createdAt).calendar(null, {
          // when the date is closer, specify custom values
          lastDay: '[Yesterday]',
          sameDay: '[Today]',
          lastWeek: 'MMMM DD, YYYY',
          sameElse: function () {
            return 'MMMM DD, YYYY'
          }
        })
        post.header = true
      }

      // Define the line demarcating which posts are "new" (have not been seen yet).
      // Checking createdNewPost is a hack to turn off this line once someone has created a new post.
      // This is needed because we add newly created posts to the end postsFuture
      // which would add the line above them saying they are "new".
      if (!createdNewPost && postsFuture && post.id === postsFuture[0]?.id) {
        post.firstUnread = true
        post.header = true
      }

      acc.push(post)
      lastPost = post
      return acc
    }, [])
  }, [postsPast, postsFuture])

  const handleResizeChats = () => {
    // Make sure when post chat box grows we stay at bottom if already there
    if (atBottom) {
      scrollToBottom()
    }
  }

  if (topicLoading) return <Loading />

  return (
    <div styleName='container'>
      <TopicFeedHeader
        bannerUrl={group && group.bannerUrl}
        currentUser={currentUser}
        followersTotal={followersTotal}
        groupSlug={groupSlug}
        isSubscribed={groupTopic && groupTopic.isSubscribed}
        newPost={newPost}
        postsTotal={postsTotal}
        toggleSubscribe={
          groupTopic
            ? () => toggleGroupTopicSubscribe(groupTopic)
            : null
        }
        topicName={topicName}
      />
      <ReactResizeDetector handleWidth={false} handleHeight onResize={handleResizeChats}>{
        ({ width, height }) => (
          <div id='chats' styleName='stream-items-container' ref={chatsRef}>
            {firstItemIndex !== false && postsForDisplay.length === 0
              ? <NoPosts className={styles['no-posts']} />
              : firstItemIndex === false
                ? <Loading />
                : <Virtuoso
                    atBottomStateChange={(bottom) => {
                      setAtBottom(bottom)
                    }}
                    endReached={() => fetchPostsFuture(postsFuture.length)}
                    data={postsForDisplay}
                    firstItemIndex={firstItemIndex}
                    initialTopMostItemIndex={currentPostIndex}
                    increaseViewportBy={200}
                    ref={virtuoso}
                    startReached={() => fetchPostsPast(postsPast.length)}
                    style={{ height: '100%', width: '100%', marginTop: 'auto' }}
                    totalCount={postsTotal}
                    itemContent={(index, post) => {
                      const expanded = selectedPostId === post.id
                      const intersectionObserver = new window.IntersectionObserver(([entry]) => {
                        if (entry.isIntersecting) {
                          handlePostVisible(post.id)
                        }
                      }, {
                        root: chatsRef.current,
                        threshold: 0.7
                      })
                      return (
                        <>
                          {post.firstUnread && !post.displayDay ? <div styleName='firstUnread'><div styleName='newPost'>NEW</div></div> : ''}
                          {post.firstUnread && post.displayDay ? <div styleName='unreadAndDay'><div styleName='newPost'>NEW</div><div styleName='day'>{post.displayDay}</div></div> : ''}
                          {post.displayDay && !post.firstUnread ? <div styleName='displayDay'><div styleName='day'>{post.displayDay}</div></div> : ''}
                          {post.type === 'chat'
                            ? <ChatPost
                                canModerate={canModerate}
                                currentUser={currentUser}
                                expanded={expanded}
                                group={group}
                                isHeader={post.header}
                                key={post.id}
                                index={index}
                                intersectionObserver={intersectionObserver}
                                post={post}
                                showDetails={showDetails}
                                updatePost={updatePost}
                              />
                            : <div styleName={cx({ 'card-item': true, expanded })}><PostCard
                                expanded={expanded}
                                key={post.id}
                                intersectionObserver={intersectionObserver}
                                post={post}
                                querystringParams={querystringParams}
                                respondToEvent={respondToEvent}
                                routeParams={routeParams}
                              /></div>}
                        </>
                      )
                    }}
                  />}
          </div>
        )
      }
      </ReactResizeDetector>
      <div styleName='post-chat-box'>
        <HyloEditor
          contentHTML={newPost.details}
          groupIds={[group.id]}
          // Disable edit cancel through escape due to event bubbling issues
          // onEscape={this.handleCancel}
          onAddTopic={handleAddTopic}
          onAddLink={handleAddLinkPreview}
          onUpdate={handleDetailsUpdate}
          onEnter={postChatMessage}
          placeholder={`Send a message to #${topicName}`}
          readOnly={pending}
          ref={editorRef}
          showMenu
          styleName='editor'
        />
        {(linkPreview || fetchLinkPreviewPending) && (
          <LinkPreview
            className={styles['link-preview']}
            loading={fetchLinkPreviewPending}
            linkPreview={linkPreview}
            featured={newPost.linkPreviewFeatured}
            onFeatured={handleFeatureLinkPreview}
            onClose={handleRemoveLinkPreview}
          />
        )}
        <AttachmentManager
          type='post'
          id='new'
          attachmentType='image'
          showAddButton
          showLabel
          showLoading
        />
        <div styleName='post-chat-box-footer'>
          <UploadAttachmentButton
            type='post'
            id='new'
            attachmentType='image'
            onSuccess={(attachment) => addAttachment('post', 'new', attachment)}
            allowMultiple
          >
            <Icon
              name='AddImage'
              styleName={cx('action-icon', { 'highlight-icon': imageAttachments && imageAttachments.length > 0 })}
            />
          </UploadAttachmentButton>
          <Button
            borderRadius='6px'
            disabled={!postInProgress}
            onClick={postChatMessage}
            styleName={cx('send-message-button', { disabled: !postInProgress })}
          >
            <IoSend color='white' />
          </Button>
        </div>
      </div>
    </div>
  )
}

