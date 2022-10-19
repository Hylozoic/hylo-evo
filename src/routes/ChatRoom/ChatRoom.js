import cx from 'classnames'
import { debounce, trim } from 'lodash/fp'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IoSend } from 'react-icons/io5'
import AttachmentManager from 'components/AttachmentManager'
import Button from 'components/Button'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import LinkPreview from 'components/PostEditor/LinkPreview'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import TopicFeedHeader from 'components/TopicFeedHeader'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import ChatPost from './ChatPost'
import styles from './ChatRoom.scss'

// Hack to fix focusing on editor after it unmounts/remounts
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
    clearImageAttachments,
    clearLinkPreview,
    context,
    createPost,
    currentUser,
    // currentUserHasMemberships,
    fetchLinkPreviewPending,
    followersTotal,
    groupTopic,
    group,
    linkPreview,
    imageAttachments,
    routeParams,
    posts,
    pending,
    postsTotal,
    querystringParams,
    removeLinkPreview,
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
    linkPreview,
    linkPreviewFeatured: false,
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


  useEffect(() => {
    props.fetchPosts(0)
  }, [context, group?.id, props.search, topicName])

  useEffect(() => {
    props.fetchTopic()
    setNewPost(emptyPost)
  }, [group?.id, topicName])

  useEffect(() => {
    setNewPost({ ...newPost, linkPreview })
  }, [linkPreview])

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
      //setTimeout(() => editorRef.current.focus(), 1000)
    }
  }, [editorRef?.current, group?.id, topicName, context])

  useEffect(() => {
    // On component unmount clear link preview TODO: and images?
    return () => {
      console.log("clear link preview")
      clearLinkPreview()
    }
  }, [])

  const postChatMessage = () => {
    // Only submit if any non-whitespace text has been added
    if (trim(editorRef.current?.getText() || '').length === 0) return

    console.log("creatng with props", props)

    const details = editorRef.current.getHTML()
    const imageUrls = imageAttachments && imageAttachments.map((attachment) => attachment.url)
    // XXX: i have no idea why linkPreview is needed here, it should be in newPost but its not and I dont know why
    console.log("create post link preview", props.linkPreview)
    console.log("create post with", { ...newPost, details, imageUrls, linkPreview: props.linkPreview })
    createPost({ ...newPost, details, imageUrls, linkPreview: props.linkPreview }).then(() => {
      setNewPost(emptyPost)
      editorRef.current.clearContent()
      editorRef.current.focus()
      clearImageAttachments()
      clearLinkPreview()
      scrollToBottom()
    })
    return true
  } // , [newPost, imageAttachments, linkPreview])

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
    const { linkPreview } = newPost
    if (linkPreview && !force) return
    props.pollingFetchLinkPreview(url)
  })

  const handleFeatureLinkPreview = featured => {
    console.log("handle link pfeature")
    setNewPost({ ...newPost, linkPreviewFeatured: featured })
  }

  const handleRemoveLinkPreview = () => {
    removeLinkPreview()
    console.log("remoew link preview")
    setNewPost({ ...newPost, linkPreview: null, linkPreviewFeatured: false })
  }

  const postsForDisplay = useMemo(() => {
    let currentHeader, lastPost
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
        isHeader = greaterThanMax || post.creator.id !== currentHeader.creator.id || lastPost.commentersTotal > 0
        currentHeader = isHeader ? post : currentHeader
      }

      acc.push(post.type === 'chat'
        ? <ChatPost
          {...post}
            currentUser={currentUser}
          forwardedRef={ref}
          expanded={expanded}
          isHeader={isHeader}
          key={post.id}
          showDetails={showDetails}
          slug={group?.slug}
        />
        : <PostCard
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
      lastPost = post
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

