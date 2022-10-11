import cx from 'classnames'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Loading from 'components/Loading'
import NoPosts from 'components/NoPosts'
import PostCard from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import TopicFeedHeader from 'components/TopicFeedHeader'
import './ChatRoom.scss'

export default function ChatRoom (props) {
  const {
    // changeSearch,
    // context,
    currentUser,
    // currentUserHasMemberships,
    followersTotal,
    groupTopic,
    group,
    newPost,
    routeParams,
    posts,
    pending,
    postsTotal,
    querystringParams,
    respondToEvent,
    // search,
    selectedPostId,
    topicLoading,
    toggleGroupTopicSubscribe
  } = props

  const { topicName, groupSlug } = routeParams

  const chatsRef = useRef()
  const currentItem = useRef()
  const topItem = useRef()
  const [ready, setReady] = useState(false)
  const [currentPost, setCurrentPost] = useState(null)
  const [topPost, setTopPost] = useState(null)

  const fetchPosts = (offset) => {
    const { pending, hasMore } = props
    if (pending || hasMore === false) return
    props.fetchPosts(offset)
  }

  useEffect(() => {
    props.fetchPosts(0)
  }, [props.context, props.group?.id, props.search, props.topicName])

  useEffect(() => {
    props.fetchTopic()
  }, [props.topicName])

  const scrollToBottom = () => {
    if (chatsRef.current) {
      chatsRef.current.scrollTop = chatsRef.current.scrollHeight
    }
  }

  useEffect(() => {
    if (posts.length && !ready) {
      setTimeout(scrollToBottom, 600)
      setReady(true)
    } else if (topItem.current) {
      setTimeout(() => {
        chatsRef.current.scrollTop = topItem.current.offsetTop - 50
      }, 500)
    }
  }, [posts])

  const postsForDisplay = useMemo(() => {
    return posts.reduce((acc, post, i) => {
      const expanded = selectedPostId === post.id
      let ref = null
      if (!currentItem.current && i === 0) {
        setCurrentPost(post)
        ref = currentItem
      } else if (!topItem.current && i === posts.length - 1) {
        setTopPost(post)
        ref = topItem
      } else if (currentPost?.id === post.id) {
        ref = currentItem
      } else if (topPost?.id === post.id) {
        ref = topItem
      }

      acc.unshift(<PostCard
        expanded={expanded}
        forwardedRef={ref}
        key={post.id}
        post={post}
        querystringParams={querystringParams}
        respondToEvent={respondToEvent}
        routeParams={routeParams}
        styleName={cx({ 'card-item': true, expanded })}
      />)
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
      <div id='chats' styleName={cx('stream-items')} ref={chatsRef}>
        {!pending && posts.length === 0 ? <NoPosts /> : ''}
        {postsForDisplay}
      </div>
      <ScrollListener
        onTop={() => fetchPosts(posts.length)}
        elementId='chats'
      />
      {pending && <Loading />}
    </div>
  )
}
