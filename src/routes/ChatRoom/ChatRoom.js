import cx from 'classnames'
import { debounce, trim } from 'lodash/fp'
import moment from 'moment-timezone'
import { EditorView } from 'prosemirror-view'
import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Helmet } from 'react-helmet'
import { IoSend } from 'react-icons/io5'
import { useResizeDetector } from 'react-resize-detector'
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
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { get, includes, isEmpty } from 'lodash/fp'
import { createSelector as ormCreateSelector } from 'redux-orm'
import {
  addAttachment,
  clearAttachments,
  getAttachments
} from 'components/AttachmentManager/AttachmentManager.store'
import {
  MODULE_NAME,
  FETCH_LINK_PREVIEW,
  pollingFetchLinkPreview,
  removeLinkPreview,
  clearLinkPreview,
  getLinkPreview
} from 'components/PostEditor/PostEditor.store'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import createPost from 'store/actions/createPost'
import fetchGroupTopic from 'store/actions/fetchGroupTopic'
import fetchPosts from 'store/actions/fetchPosts'
import fetchTopic from 'store/actions/fetchTopic'
import respondToEvent from 'store/actions/respondToEvent'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'
import updateGroupTopicLastReadPost from 'store/actions/updateGroupTopicLastReadPost'
import updatePost from 'store/actions/updatePost'
import { FETCH_POSTS, FETCH_TOPIC, FETCH_GROUP_TOPIC } from 'store/constants'
import orm from 'store/models'
import presentPost from 'store/presenters/presentPost'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import getGroupTopicForCurrentRoute from 'store/selectors/getGroupTopicForCurrentRoute'
import getMe from 'store/selectors/getMe'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { getHasMorePosts, getPostResults, getTotalPosts } from 'store/selectors/getPosts'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import isPendingFor from 'store/selectors/isPendingFor'
import { postUrl } from 'util/navigation'

import styles from './ChatRoom.module.scss'

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

// Move this selector inside the component file
const getPosts = ormCreateSelector(
  orm,
  getPostResults,
  (session, results) => {
    if (isEmpty(results)) return null
    if (isEmpty(results.ids)) return []
    return session.Post.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(p => Number(p.id))
      .toModelArray()
      .map(p => presentPost(p))
  }
)

const NUM_POSTS_TO_LOAD = 25

export default function ChatRoom (props) {
  const dispatch = useDispatch()
  const params = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const { groupSlug, topicName, context, view, postId: selectedPostId } = params

  const currentUser = useSelector(getMe)
  const group = useSelector(state => getGroupForSlug(state, groupSlug))
  const groupTopic = useSelector(state => getGroupTopicForCurrentRoute(state, groupSlug, topicName))
  const topic = useSelector(state => getTopicForCurrentRoute(state, topicName))
  const topicLoading = useSelector(state => isPendingFor([FETCH_TOPIC, FETCH_GROUP_TOPIC], state))
  const imageAttachments = useSelector(state => getAttachments(state, { type: 'post', id: 'new', attachmentType: 'image' }))
  const linkPreview = useSelector(getLinkPreview)
  const fetchLinkPreviewPending = useSelector(state => isPendingFor(FETCH_LINK_PREVIEW, state))
  const pending = useSelector(state => state.pending[FETCH_POSTS])
  const followersTotal = useMemo(() => get('followersTotal', groupSlug ? groupTopic : topic), [groupSlug, groupTopic, topic])
  const querystringParams = useSelector(state => getQuerystringParam(['search', 'postId'], { location }))
  const search = querystringParams?.search
  const postIdToStartAt = querystringParams?.postId

  const fetchPostsPastParams = useMemo(() => ({
    childPostInclusion: 'no',
    context,
    cursor: parseInt(postIdToStartAt) + 1 || parseInt(groupTopic?.lastReadPostId) + 1,
    filter: 'chat',
    first: NUM_POSTS_TO_LOAD,
    order: 'desc',
    slug: groupSlug,
    search,
    sortBy: 'id',
    topic: topic?.id
  }), [context, postIdToStartAt, groupTopic?.lastReadPostId, groupSlug, search, topic?.id])

  const fetchPostsFutureParams = useMemo(() => ({
    childPostInclusion: 'no',
    context,
    cursor: postIdToStartAt || groupTopic?.lastReadPostId,
    filter: 'chat',
    first: NUM_POSTS_TO_LOAD,
    order: 'asc',
    slug: groupSlug,
    search,
    sortBy: 'id',
    topic: topic?.id
  }), [context, postIdToStartAt, groupTopic?.lastReadPostId, groupSlug, search, topic?.id])

  const postsPast = useSelector(state => (postIdToStartAt || groupTopic?.lastReadPostId) ? getPosts(state, fetchPostsPastParams) : [])
  const hasMorePostsPast = useSelector(state => getHasMorePosts(state, fetchPostsPastParams))
  const totalPostsPast = useSelector(state => getTotalPosts(state, fetchPostsPastParams) || 0)
  const currentPostIndex = totalPostsPast ? Math.min(Math.max(totalPostsPast - 2, 0), NUM_POSTS_TO_LOAD - 1) : 0

  const postsFuture = useSelector(state => getPosts(state, fetchPostsFutureParams))
  const hasMorePostsFuture = useSelector(state => getHasMorePosts(state, fetchPostsFutureParams))
  const totalPostsFuture = useSelector(state => getTotalPosts(state, fetchPostsFutureParams) || 0)

  // Convert mapDispatchToProps to useCallback hooks
  const fetchPostsPast = useCallback((offset) => {
    const { pending, hasMorePostsPast } = props
    if (pending || hasMorePostsPast === false) return
    setLoadingPast(true)
    dispatch(fetchPosts({ offset, ...fetchPostsPastParams })).then(() => setLoadingPast(false))
  }, [fetchPostsPastParams])

  const fetchPostsFuture = useCallback((offset) => {
    const { pending, hasMorePostsFuture } = props
    if (pending || hasMorePostsFuture === false) return
    setLoadingFuture(true)
    dispatch(fetchPosts({ ...fetchPostsFutureParams, offset })).then(() => setLoadingFuture(false))
  }, [fetchPostsFutureParams])

  const fetchTopicAction = useCallback(() => {
    if (groupSlug && topicName) {
      return dispatch(fetchGroupTopic(topicName, groupSlug))
    } else if (topicName) {
      return dispatch(fetchTopic(topicName))
    }
  }, [dispatch, groupSlug, topicName])

  const changeSearch = useCallback((search) => {
    return dispatch(changeQuerystringParam({ location }, 'search', search, 'all'))
  }, [dispatch, location])

  const clearImageAttachments = useCallback(() => dispatch(clearAttachments('post', 'new', 'image')), [dispatch])

  const pollingFetchLinkPreviewAction = useCallback(
    fetchLinkPreviewPending
      ? () => Promise.resolve()
      : (url) => pollingFetchLinkPreview(dispatch, url),
    [fetchLinkPreviewPending]
  )

  const respondToEventAction = useCallback((post) => (response) => dispatch(respondToEvent(post, response)), [dispatch])

  const showDetails = useCallback((postId) => {
    navigate(postUrl(postId, params, { ...location.state, ...querystringParams }))
  }, [navigate, params, location.state, querystringParams])

  const toggleGroupTopicSubscribeAction = useCallback((groupTopic) => dispatch(toggleGroupTopicSubscribe(groupTopic)), [dispatch])

  const updateGroupTopicLastReadPostAction = useCallback((groupTopicId, postId) => dispatch(updateGroupTopicLastReadPost(groupTopicId, postId)), [dispatch])

  const updatePostAction = useCallback((post) => dispatch(updatePost(post)), [dispatch])

  const createPostAction = useCallback((post) => dispatch(createPost(post)), [dispatch])

  const removeLinkPreviewAction = useCallback(() => dispatch(removeLinkPreview()), [dispatch])

  const clearLinkPreviewAction = useCallback(() => dispatch(clearLinkPreview()), [dispatch])

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

  useEffect(() => {
    // New chat room loaded
    console.log('ChatRoom useEffect basic')

    // Reset everything
    setFirstItemIndex(false)
    clearLinkPreview()
    clearImageAttachments()
    setNewPost(emptyPost)
    cachedTotalPostsPast.current = false
    cachedTotalPostsFuture.current = false
    postsTotal.current = false

    // Make sure GroupTopic is loaded
    fetchTopicAction()
  }, [group?.id, topicName])

  useEffect(() => {
    // On component unmount clear link preview and images attachments from redux
    return () => {
      clearLinkPreview()
      clearImageAttachments()
    }
  }, [])

  useEffect(() => {
    console.log('ChatRoom useEffect groupTopic')
    // New group topic
    if (groupTopic?.id) {
      fetchPostsFuture(0)
      if (groupTopic.lastReadPostId) {
        fetchPostsPast(0)
      }
      // Reset last read post
      setLastReadPostId(groupTopic.lastReadPostId)
    }

    if (editorRef.current) {
      setTimeout(() => {
        // In case we unmounted really quick and its no longer here
        if (editorRef.current) {
          editorRef.current.focus()
        }
      }, 600)
    }
  }, [groupTopic?.id])

  // Do once after loading posts for the room to get things ready
  useEffect(() => {
    console.log('ChatRoom useEffect postsPast and postsFuture')
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
    console.log('ChatRoom useEffect totalPostsFuture')
    // If the total number of future posts changes updated it, unless its 0, because of bug on the server
    // Check if cachedTotalPostsPast is set because we want to make sure we have the correct final total past posts before updating postsTotal
    // https://github.com/Hylozoic/hylo-node/issues/901
    if (cachedTotalPostsPast.current !== false && (!cachedTotalPostsFuture.current || totalPostsFuture)) {
      cachedTotalPostsFuture.current = totalPostsFuture
      postsTotal.current = totalPostsFuture + cachedTotalPostsPast.current
    }

    // If scrolled to bottom and a new post comes in make sure to scroll down to see new post
    if (atBottom && virtuoso.current) {
      setTimeout(() => {
        scrollToBottom()
      }, 300)
    }
  }, [totalPostsFuture])

  // Update first item index as we prepend posts when scrolling up, to stay scrolled to same post
  useEffect(() => {
    console.log('ChatRoom useEffect firstItemIndex')
    if (postsPast?.length && firstItemIndex !== false) {
      setFirstItemIndex(postsTotal.current - (postsPast?.length || 0) - (postsFuture?.length || 0))
    }
  }, [postsPast?.length, firstItemIndex])

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
    pollingFetchLinkPreviewAction(url)
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

  const scrollToBottom = useCallback(() => { // scrollToBottom is here but no scroll to index...
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

  const { height } = useResizeDetector({ handleWidth: false, targetRef: chatsRef, onResize: handleResizeChats })

  // Create a new chat post
  const postChatMessage = useEventCallback(async () => {
    // Only submit if any non-whitespace text has been added
    if (trim(editorRef.current?.getText() || '').length === 0) return

    const details = editorRef.current.getHTML()
    const imageUrls = imageAttachments && imageAttachments.map((attachment) => attachment.url)
    const topicNames = newPost.topics?.map((t) => t.name)
    const postToSave = { ...newPost, details, imageUrls, topicNames }

    // Clear create form instantly to make it feel faster and prevent double submit
    editorRef.current.clearContent()
    clearLinkPreview()
    clearImageAttachments()

    await createPost(postToSave)
    setNewPost(emptyPost)
    setCreatedNewPost(true)
    editorRef.current.focus()
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

  if (topicLoading) return <Loading />

  return (
    <div className={cx(styles.container, { [styles.withoutNav]: withoutNav })}>
      <Helmet>
        <title>#{topicName} | {group ? `${group.name} | ` : ''}Hylo</title>
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
      <div id='chats' className={styles.streamItemsContainer} ref={chatsRef}>
        {loadingPast && <div className={styles.loadingContainer}><Loading /></div>}
        {firstItemIndex !== false && postsForDisplay.length === 0
          ? <NoPosts className={styles.noPosts} />
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
                    {post.firstUnread && !post.displayDay ? (
                      <div className={styles.firstUnread}>
                        <div className={styles.divider} />
                        <div className={styles.newPost}>NEW</div>
                      </div>
                    ) : null}
                    {post.firstUnread && post.displayDay ? (
                      <div className={styles.unreadAndDay}>
                        <div className={styles.divider} />
                        <div className={styles.newPost}>NEW</div>
                        <div className={styles.day}>{post.displayDay}</div>
                      </div>
                    ) : null}
                    {post.displayDay && !post.firstUnread ? (
                      <div className={styles.displayDay}>
                        <div className={styles.divider} />
                        <div className={styles.day}>{post.displayDay}</div>
                      </div>
                    ) : null}
                    {post.type === 'chat'
                      ? <ChatPost
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
                      : <div className={cx(styles.cardItem, { [styles.expanded]: expanded })}>
                        <PostCard
                          expanded={expanded}
                          key={post.id}
                          intersectionObserver={intersectionObserver}
                          post={post}
                          querystringParams={querystringParams}
                          respondToEvent={respondToEvent}
                          routeParams={routeParams}
                        />
                      </div>}
                  </>
                )
              }}
            />}
        {loadingFuture && <div className={styles.loadingContainerBottom}><Loading /></div>}
      </div>
      <div className={styles.postChatBox}>
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
          className={styles.editor}
        />
        {(linkPreview || fetchLinkPreviewPending) && (
          <LinkPreview
            className={styles.linkPreview}
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
        <div className={styles.postChatBoxFooter}>
          <UploadAttachmentButton
            type='post'
            className={styles.uploadAttachment}
            id='new'
            attachmentType='image'
            onSuccess={(attachment) => addAttachment('post', 'new', attachment)}
            allowMultiple
          >
            <Icon
              name='AddImage'
              className={cx(styles.actionIcon, { [styles.highlightIcon]: imageAttachments && imageAttachments.length > 0 })}
            />
          </UploadAttachmentButton>
          <Button
            borderRadius='6px'
            disabled={!postInProgress}
            onClick={postChatMessage}
            className={cx(styles.sendMessageButton, { [styles.disabled]: !postInProgress })}
          >
            <IoSend color='white' />
          </Button>
        </div>
      </div>
    </div>
  )
}
