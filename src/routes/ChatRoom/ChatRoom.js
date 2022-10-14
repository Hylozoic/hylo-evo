import cx from 'classnames'
import { debounce, trim } from 'lodash/fp'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import AttachmentManager from 'components/AttachmentManager'
import Button from 'components/Button'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import TopicFeedHeader from 'components/TopicFeedHeader'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import ChatPost from './ChatPost'
import './ChatRoom.scss'

import { EditorView } from 'prosemirror-view'

EditorView.prototype.updateState = function updateState (state) {
  if (!this.docView) return // This prevents the matchesNode error on hot reloads
  this.updateStateInner(state, this.state.plugins !== state.plugins)
}

// the maximum amount of time in minutes that can pass between messages to still
// include them under the same avatar and timestamp
const MAX_MINS_TO_BATCH = 5

export default function ChatRoom (props) {
  const {
    // changeSearch,
    addAttachment,
    context,
    createPost,
    currentUser,
    // currentUserHasMemberships,
    followersTotal,
    groupTopic,
    group,
    imageAttachments,
    routeParams,
    posts,
    pending,
    postsTotal,
    querystringParams,
    respondToEvent,
    // search,
    selectedPostId,
    showDetails,
    topicLoading,
    topic,
    toggleGroupTopicSubscribe
  } = props

  const { topicName, groupSlug } = routeParams

  const emptyPost = useMemo(() => ({
    details: '',
    groups: group ? [group] : [],
    location: '',
    title: null,
    // topics: topic ? [topic] : [],
    topicNames: [topicName],
    type: 'chat'
  }), [group, topicName])

  const chatsRef = useRef()
  const currentItemRef = useRef()
  const editorRef = useRef()
  const topItemRef = useRef()
  const [ready, setReady] = useState(false)
  const [postInProgress, setPostInProgress] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [topPost, setTopPost] = useState(null)
  const [newPost, setNewPost] = useState(emptyPost)

  const fetchPosts = useCallback((offset) => {
    const { pending, hasMore } = props
    if (pending || hasMore === false) return
    props.fetchPosts(offset)
  }, [props.fetchPosts])

  const scrollToBottom = useCallback(() => {
    if (chatsRef.current) {
      console.log("scroll to botto")
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight
    }
  }, [])

  const postChatMessage = useCallback(() => {
    // Only submit if any non-whitespace text has been added
    if (trim(editorRef.current?.getText() || '').length === 0) return

    const details = editorRef.current.getHTML()
    const imageUrls = imageAttachments && imageAttachments.map((attachment) => attachment.url)
    createPost({ ...newPost, details, imageUrls }).then(() => {
      setNewPost(emptyPost)
      editorRef.current.clearContent()
      editorRef.current.focus()
      scrollToBottom()
    })
    return true
  }, [newPost, imageAttachments])

  useEffect(() => {
    props.fetchPosts(0)
  }, [context, group?.id, props.search, topicName])

  useEffect(() => {
    props.fetchTopic()
  }, [group?.id, topicName])

  useEffect(() => {
    setNewPost(emptyPost)
  }, [group?.id, topicName])

  useEffect(() => {
    console.log("check scroll topitem", topItemRef.current)
    if (posts.length && !ready) {
      setTimeout(scrollToBottom, 600)
      setReady(true)
    } else if (topItemRef.current) {
      console.log("scroll to previous post", topItemRef.current.offsetTop, topItemRef.current)
      setTimeout(() => {
        chatsRef.current.scrollTop = topItemRef.current.offsetTop - 50
        //setTopPost(null)
      }, 500)
    }
  }, [pending])

  useEffect(() => {
    console.log("current = ", editorRef.current)
    if (editorRef.current) {
      console.log("focus")
      setTimeout(() => editorRef.current.focus(), 1000)
    }
  }, [editorRef?.current, group?.id, topicName, context])

  const handleDetailsUpdate = (d) => {
    const hasText = trim(editorRef.current?.getText() || '').length > 0
    setPostInProgress(hasText)
  }

  const handleAddTopic = topic => {
    // const { post, allowAddTopic } = this.state

    // if (!allowAddTopic || post?.topics?.length >= MAX_POST_TOPICS) return

    // this.setState({ post: { ...post, topics: [...post.topics, topic] } })
    // this.setIsDirty(true)
    console.log("add topic")
  }

  // Checks for linkPreview every 1/2 second
  const handleAddLinkPreview = debounce(500, (url, force) => {
    // const { pollingFetchLinkPreview } = this.props
    // const { linkPreview } = this.state.post

    // if (linkPreview && !force) return

    // pollingFetchLinkPreview(url)
    console.log("link preview")
  })

  const postsForDisplay = useMemo(() => {
    let currentHeader
    return posts.reduce((acc, post, i) => {
      const expanded = selectedPostId === post.id
      let ref = null
      if (!currentItemRef.current && i === posts.length - 1) {
        setCurrentPost(post)
        ref = currentItemRef
      } else if (!topItemRef.current && i === 0) {
        console.log("set top post)", post)
        setTopPost(post)
        ref = topItemRef
      } else if (currentPost?.id === post.id) {
        ref = currentItemRef
      } else if (topPost?.id === post.id) {
        ref = topItemRef
      }

      let headerDate, messageDate, diff, greaterThanMax
      let isHeader = false
      if (!currentHeader) {
        isHeader = true
        currentHeader = post
      } else {
        headerDate = new Date(currentHeader.createdAt)
        messageDate = new Date(post.createdAt)
        diff = Math.abs(headerDate - messageDate)
        greaterThanMax = Math.floor(diff / 60000) > MAX_MINS_TO_BATCH
        isHeader = greaterThanMax || post.creator.id !== currentHeader.creator.id
        currentHeader = isHeader ? post : currentHeader
      }

      acc.push(post.type === 'chat' ?
        <ChatPost
          {...post}
          forwardedRef={ref}
          expanded={expanded}
          isHeader={isHeader}
          key={post.id}
          showDetails={showDetails}
          slug={group?.slug}
        />
        :
        <PostCard
          expanded={expanded}
          forwardedRef={ref}
          key={post.id}
          post={post}
          querystringParams={querystringParams}
          respondToEvent={respondToEvent}
          routeParams={routeParams}
          styleName={cx({ 'card-item': true, expanded })}
        />
      )
      return acc
    }, [])
  }, [posts])

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
      <div id='chats' styleName='stream-items-container' ref={chatsRef}>
        <div styleName='stream-items'>
          {!pending && posts.length === 0 ? <NoPosts /> : ''}
          {postsForDisplay}
        </div>
      </div>
      <ScrollListener
        onTop={() => fetchPosts(posts.length)}
        elementId='chats'
      />
      {pending && <Loading />}
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
        <Button
          borderRadius='6px'
          disabled={!postInProgress}
          onClick={postChatMessage}
          styleName={cx('send-message-button', { disabled: !postInProgress })}
        >
          <IoSend color='white' />
        </Button>
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
        </div>
      </div>
    </div>
  )
}

