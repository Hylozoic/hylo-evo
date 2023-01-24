import cx from 'classnames'
import { debounce, trim } from 'lodash/fp'
import { DateTime } from 'luxon'
import { EditorView } from 'prosemirror-view'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { IoSend } from 'react-icons/io5'
import ReactResizeDetector from 'react-resize-detector'
import { Virtuoso } from 'react-virtuoso'
import AttachmentManager from 'components/AttachmentManager'
import { useLayoutFlags } from 'contexts/LayoutFlagsContext'
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
import isWebView from 'util/webView'
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
    addAttachment,
    clearImageAttachments,
    clearLinkPreview,
    createPost,
    canModerate,
    currentPostIndex,
    currentUser,
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
    totalPostsFuture,
    totalPostsPast,
    querystringParams,
    removeLinkPreview,
    respondToEvent,
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
  const virtuoso = useRef(null)

  const { hideNavLayout } = useLayoutFlags()
  const withoutNav = isWebView() || hideNavLayout

  // Whether scroll is at the bottom of the chat (most recent post)
  const [atBottom, setAtBottom] = useState(false)

  // Whether the current user has a created a new post in the room yet
  const [createdNewPost, setCreatedNewPost] = useState(false)

  // Track the index of the top most loaded post in relationship to the total # posts in this chat room, needed to track scroll position
  const [firstItemIndex, setFirstItemIndex] = useState(false)

  // What was the last post read by the current user. Doesn't update in real time as they scroll only when room is reloaded
  const [lastReadPostId, setLastReadPostId] = useState(groupTopic?.lastReadPostId)

  // Whether we are currently loading more past posts or future posts
  const [loadingPast, setLoadingPast] = useState(false)
  const [loadingFuture, setLoadingFuture] = useState(false)

  // The data for an in progress post draft
  const [newPost, setNewPost] = useState(emptyPost)

  // Whether there is an in progress new post draft
  const [postInProgress, setPostInProgress] = useState(false)

  // Need a ref for this one because we need to lookup the current value in many hooks
  const postsTotal = useRef(false)

  // Cache total number of posts here to handle bug on back-end
  // https://github.com/Hylozoic/hylo-node/issues/901
  const cachedTotalPostsPast = useRef(false)
  const cachedTotalPostsFuture = useRef(false)

  const fetchPostsPastLocal = useCallback((offset) => {
    const { pending, hasMorePostsPast } = props
    if (pending || hasMorePostsPast === false) return
    setLoadingPast(true)
    props.fetchPostsPast(offset).then(() => setLoadingPast(false))
  }, [props.fetchPostsPast])

  const fetchPostsFutureLocal = useCallback((offset) => {
    const { pending, hasMorePostsFuture } = props
    if (pending || hasMorePostsFuture === false) return
    setLoadingFuture(true)
    props.fetchPostsFuture(offset).then(() => setLoadingFuture(false))
  }, [props.fetchPostsFuture])

  useEffect(() => {
    // New chat room loaded
    // Reset everything
    setFirstItemIndex(false)
    clearLinkPreview()
    clearImageAttachments()
    setNewPost(emptyPost)
    cachedTotalPostsPast.current = false
    cachedTotalPostsFuture.current = false
    postsTotal.current = false

    // Make sure GroupTopic is loaded
    props.fetchTopic()
  }, [group?.id, topicName])

  useEffect(() => {
    // On component unmount clear link preview and images attachments from redux
    return () => {
      clearLinkPreview()
      clearImageAttachments()
    }
  }, [])

  useEffect(() => {
    // New group topic
    if (groupTopic?.id) {
      props.fetchPostsFuture(0)
      if (groupTopic.lastReadPostId) {
        props.fetchPostsPast(0)
      }
      // Reset last read post
      setLastReadPostId(groupTopic.lastReadPostId)
    }
  }, [groupTopic?.id])

  // Do once after loading posts for the room to get things ready
  useEffect(() => {
    if (postsPast !== null && postsFuture !== null) {
      // Set this once and don't change it because if a bug on the backend
      // https://github.com/orgs/Hylozoic/projects/2/views/13?filterQuery=
      if (cachedTotalPostsPast.current === false) {
        cachedTotalPostsPast.current = totalPostsPast
        cachedTotalPostsFuture.current = totalPostsFuture
        postsTotal.current = totalPostsPast + totalPostsFuture
      }

      if (firstItemIndex === false) {
        setFirstItemIndex(postsTotal.current - postsPast.length - postsFuture.length)
      }

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
    // If the total number of future posts changes updated it, unless its 0, because of bug on the server
    // Check if cachedTotalPostsPast is set because we want to make sure we have the correct final total past posts before updating postsTotal
    // https://github.com/Hylozoic/hylo-node/issues/901
    if (cachedTotalPostsPast.current !== false && (!cachedTotalPostsFuture.current || totalPostsFuture)) {
      cachedTotalPostsFuture.current = totalPostsFuture
      postsTotal.current = totalPostsFuture + cachedTotalPostsPast.current
    }
  }, [totalPostsFuture])

  // Update first item index as we prepend posts when scrolling up, to stay scrolled to same post
  useEffect(() => {
    if (postsPast?.length && firstItemIndex !== false) {
      setFirstItemIndex(postsTotal.current - (postsPast?.length || 0) - (postsFuture?.length || 0))
    }
  }, [postsPast?.length, firstItemIndex])

  // Focus on chat box when entering the room
  useEffect(() => {
    if (editorRef.current) {
      setTimeout(() => {
        // In case we unmounted really quick and its no longer here
        if (editorRef.current) {
          editorRef.current.focus()
        }
      }, 600)
    }
  }, [groupTopic?.id])

  // When text is entered in a draft post set postInProgress to true
  const handleDetailsUpdate = (d) => {
    const hasText = trim(editorRef.current?.getText() || '').length > 0
    setPostInProgress(hasText)
  }

  // Add a topic to the new post
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

  // Have to wait for the link preview to load from the server before adding to the new post
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

  // When scrolling to a new unread post update the last read post id in this topic for this user
  const handlePostVisible = (postId) => {
    if (lastReadPostId && postId > lastReadPostId) {
      setLastReadPostId(postId)
      updateGroupTopicLastReadPost(groupTopic.id, postId)
    }
  }

  // If scrolled to bottom and a new post comes in make sure to scroll down to see new post
  useEffect(() => {
    if (atBottom && virtuoso.current) {
      setTimeout(() => {
        scrollToBottom()
      }, 300)
    }
  }, [totalPostsFuture])

  const scrollToBottom = useCallback(() => {
    if (virtuoso.current) {
      virtuoso.current.scrollToIndex(postsTotal.current)
    }
  }, [])

  const handleResizeChats = () => {
    // Make sure when post chat box grows we stay at bottom if already there
    if (atBottom) {
      scrollToBottom()
    }
  }

  // Create a new chat post
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
        /* Display the author header if its been more than 5 minutes since last header,
         *   or the last post was a different author,
         *   or if last post had any comments on it,
         *   or if the last past was a non chat type post
        */
        post.header = greaterThanMax || post.creator.id !== currentHeader.creator.id || lastPost.commentersTotal > 0 || lastPost.type !== 'chat'
        currentHeader = post.header ? post : currentHeader
      }

      // Is this a new day, then display it as a header
      newDay = DateTime.fromISO(post.createdAt).toLocaleString(DateTime.DATE_FULL)
      if (!currentDay || currentDay !== newDay) {
        currentDay = newDay
        // Ensure the date is displayed with today and yesterday
        post.displayDay = DateTime.fromISO(post.createdAt).toRelativeCalendar(null, {
          // when the date is closer, specify custom values
          lastDay: '[Yesterday]',
          sameDay: '[Today]',
          lastWeek: DateTime.DATE_FULL,
          sameElse: function () {
            return DateTime.DATE_FULL
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

  if (topicLoading) return <Loading />

  return (
    <div styleName={cx('container', { 'without-nav': withoutNav })}>
      <Helmet>
        <title>Hylo{group ? `: ${group.name} #${topicName}` : ''}</title>
      </Helmet>

      <TopicFeedHeader
        bannerUrl={group && group.bannerUrl}
        currentUser={currentUser}
        followersTotal={followersTotal}
        groupSlug={groupSlug}
        isSubscribed={groupTopic && groupTopic.isSubscribed}
        newPost={newPost}
        postsTotal={postsTotal.current}
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
            {loadingPast && <div styleName='loading-container'><Loading /></div>}
            {firstItemIndex !== false && postsForDisplay.length === 0
              ? <NoPosts className={styles['no-posts']} />
              : firstItemIndex === false
                ? <Loading />
                : <Virtuoso
                  atBottomStateChange={(bottom) => {
                    setAtBottom(bottom)
                  }}
                  endReached={() => fetchPostsFutureLocal(postsFuture.length)}
                  data={postsForDisplay}
                  firstItemIndex={firstItemIndex}
                  initialTopMostItemIndex={currentPostIndex}
                  increaseViewportBy={200}
                  ref={virtuoso}
                  startReached={() => fetchPostsPastLocal(postsPast.length)}
                  style={{ height: '100%', width: '100%', marginTop: 'auto' }}
                  totalCount={postsTotal.current}
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
                        {post.firstUnread && !post.displayDay ? <div styleName='firstUnread'><div styleName='divider' /><div styleName='newPost'>NEW</div></div> : ''}
                        {post.firstUnread && post.displayDay ? <div styleName='unreadAndDay'><div styleName='divider' /><div styleName='newPost'>NEW</div><div styleName='day'>{post.displayDay}</div></div> : ''}
                        {post.displayDay && !post.firstUnread ? <div styleName='displayDay'><div styleName='divider' /><div styleName='day'>{post.displayDay}</div></div> : ''}
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
            {loadingFuture && <div styleName='loading-container bottom'><Loading /></div>}
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
          showMenu={!isWebView()}
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
            className={styles['upload-attachment']}
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
