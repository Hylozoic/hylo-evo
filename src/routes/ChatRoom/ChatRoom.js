import cx from 'classnames'
import { debounce, trim } from 'lodash/fp'
import moment from 'moment-timezone'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Virtuoso } from 'react-virtuoso'
import { IoSend } from 'react-icons/io5'
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
    toggleGroupTopicSubscribe,
    updateGroupTopicLastReadPost
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
  const editorRef = useRef()
  const virtuoso = useRef(null);

  const [atBottom, setAtBottom] = useState(false)
  const [postInProgress, setPostInProgress] = useState(false)
  const [lastReadPostId, setLastReadPostId] = useState(groupTopic.lastReadPostId)
  const [newPost, setNewPost] = useState(emptyPost)
  const [firstItemIndex, setFirstItemIndex] = useState(false)

  const fetchPosts = useCallback((offset) => {
    const { pending, hasMore } = props
    if (pending || hasMore === false) return
    props.fetchPosts(offset)
  }, [props.fetchPosts])

  useEffect(() => {
    props.fetchPosts(0)
  }, [context, group?.id, props.search, topicName])

  useEffect(() => {
    props.fetchTopic()
    setNewPost(emptyPost)
    setLastReadPostId(groupTopic.lastReadPostId)
  }, [group?.id, groupTopic?.id, topicName])

  // TODO: Loren why do we need this? handleAddLinkPreview not working to update state?
  useEffect(() => {
    setNewPost({ ...newPost, linkPreview })
  }, [linkPreview])

  useEffect(() => {
    if (!pending) {
      console.log("pending changed got posys num", posts.length, postsTotal)
      if (posts.length) {
        setFirstItemIndex(postsTotal - posts.length)
        if (!lastReadPostId) {
          updateGroupTopicLastReadPost(groupTopic.id, posts[posts.length - 1].id)
          setLastReadPostId(posts[posts.length - 1].id)
        }
      }
    }
  }, [pending])

  useEffect(() => {
    console.log("posts total changed", postsTotal, atBottom)
    if (atBottom) {
      setTimeout(() => {
        console.log("do scrollll")
        virtuoso.current.scrollToIndex(postsTotal - 1)
      }, 300)
    }
  }, [postsTotal])

  // useEffect(() => {
  //   // console.log("current = ", editorRef.current)
  //   if (editorRef.current) {
  //     console.log("focus")
  //     //setTimeout(() => editorRef.current.focus(), 1000)
  //   }
  // }, [editorRef?.current, group?.id, topicName, context])

  useEffect(() => {
    // On component unmount clear link preview TODO: and images?
    return () => {
      console.log("unmounting")
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
      console.log("after created post")
      // scrollToBottom()
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

  const handlePostVisible = (postId) => {
    // console.log("is it greater? ", groupTopic.lastReadPostId, postId)
    if (lastReadPostId && postId > lastReadPostId) {
      setLastReadPostId(postId)
      updateGroupTopicLastReadPost(groupTopic.id, postId)
    }
  }

  const postsForDisplay = useMemo(() => {
    let currentHeader, lastPost, firstUnreadPost, currentDay, newDay
    return posts.reduce((acc, post, i) => {
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
      }

      if (post.id > lastReadPostId && !firstUnreadPost) {
        firstUnreadPost = post
        post.firstUnread = true
      }

      acc.push(post)
      lastPost = post
      return acc
    }, [])
  }, [posts])

  if (topicLoading) return <Loading />

  console.log("at bottom", atBottom)
  console.log("postsTotal", postsTotal)
  console.log("initial index, first item index", postsTotal - 1, firstItemIndex)
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
        {!pending && posts.length === 0
          ? <NoPosts />
          : pending && posts.length === 0
            ? <Loading />
            : <Virtuoso
                atBottomStateChange={(bottom) => {
                  setAtBottom(bottom)
                }}
                data={postsForDisplay}
                firstItemIndex={firstItemIndex}
                initialTopMostItemIndex={postsTotal - 1}
                increaseViewportBy={200}
                // rangeChanged={setNewCurrentPost}
                ref={virtuoso}
                startReached={() => fetchPosts(posts.length)}
                style={{ height: '100%', width: '100%', marginTop: 'auto' }}
                // followOutput={atBottom ? 'smooth' : false}
                // followOutput={true}
                totalCount={postsTotal}
                itemContent={(index, post) => {
                  const expanded = selectedPostId === post.id
                  return (
                    <>
                      {post.displayDay ? <div>{post.displayDay}................................................</div> : ''}
                      {post.firstUnread ? <div>New posts below this line ..........................................</div> : ''}
                      {post.type === 'chat'
                        ? <ChatPost
                            {...post}
                            currentUser={currentUser}
                            // forwardedRef={ref}
                            expanded={expanded}
                            isHeader={post.header}
                            key={post.id}
                            index={index}
                            onVisible={handlePostVisible}
                            showDetails={showDetails}
                            slug={group?.slug}
                          />
                        : <PostCard
                            expanded={expanded}
                            // forwardedRef={ref}
                            key={post.id}
                            post={post}
                            querystringParams={querystringParams}
                            respondToEvent={respondToEvent}
                            routeParams={routeParams}
                            styleName={cx({ 'card-item': true, expanded })}
                          />}
                    </>
                  )
                }}
              />}
      </div>
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

