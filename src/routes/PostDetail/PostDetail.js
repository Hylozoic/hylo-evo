import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { throttle, isEmpty } from 'lodash/fp'
import './PostDetail.scss'
import { PostImage, PostBody, PostFooter, PostHeader, PostCommunities } from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import Comments from './Comments'
import { tagUrl } from 'util/index'
import { DETAIL_COLUMN_ID, position } from 'util/scrolling'
import SocketSubscriber from 'components/SocketSubscriber'
import Button from 'components/Button'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'

const { func, object, string } = PropTypes

// the height of the header plus the padding-top
const STICKY_HEADER_SCROLL_OFFSET = 78

export default class PostDetail extends Component {
  static propTypes = {
    post: object,
    id: string,
    currentUser: object,
    slug: string,
    fetchPost: func
  }

  constructor (props) {
    super(props)
    this.state = {
      atHeader: false,
      headerWidth: 0,
      headerScrollOffset: 0,
      atActivity: false,
      activityWidth: 0,
      activityScrollOffset: 0
    }
  }

  setHeaderStateFromDOM = () => {
    const container = document.getElementById(DETAIL_COLUMN_ID)
    if (!container) return
    this.setState({
      headerWidth: container.offsetWidth
    })
  }

  setActivityStateFromDOM = activity => {
    const element = ReactDOM.findDOMNode(activity)
    const container = document.getElementById(DETAIL_COLUMN_ID)
    if (!element || !container) return
    const offset = position(element, container).y - STICKY_HEADER_SCROLL_OFFSET
    this.setState({
      activityWidth: element.offsetWidth,
      activityScrollOffset: offset
    })
  }

  componentDidMount () {
    this.onPostIdChange()
  }

  componentDidUpdate (prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.onPostIdChange()
    }
  }

  onPostIdChange = () => {
    this.props.fetchPost()
  }

  handleScroll = throttle(100, event => {
    const { scrollTop } = event.target
    const {
      atHeader,
      atActivity,
      headerScrollOffset,
      activityScrollOffset
    } = this.state
    if (!atActivity && scrollTop >= activityScrollOffset) {
      this.setState({atActivity: true})
    } else if (atActivity && scrollTop < activityScrollOffset) {
      this.setState({atActivity: false})
    }

    if (!atHeader && scrollTop > headerScrollOffset) {
      this.setState({atHeader: true})
    } else if (atHeader && scrollTop <= headerScrollOffset) {
      this.setState({atHeader: false})
    }
  })

  render () {
    const { post, slug, pending, isMember, joinProject, leaveProject } = this.props
    const { atHeader, atActivity, headerWidth, activityWidth } = this.state

    if (!post && !pending) {
      return <NotFound />
    }

    if (pending) {
      return <Loading />
    }

    const scrollToBottom = () => {
      const detail = document.getElementById(DETAIL_COLUMN_ID)
      detail.scrollTop = detail.scrollHeight
    }

    const headerStyle = {
      width: headerWidth + 'px'
    }
    const activityStyle = {
      width: activityWidth + 'px',
      marginTop: STICKY_HEADER_SCROLL_OFFSET + 'px'
    }

    return <div styleName='post' ref={this.setHeaderStateFromDOM}>
      <ScrollListener elementId={DETAIL_COLUMN_ID}
        onScroll={this.handleScroll} />
      <WrappedPostHeader {...this.props} />
      {atHeader && <div styleName='header-sticky' style={headerStyle}>
        <WrappedPostHeader {...this.props} />
      </div>}
      <PostImage postId={post.id} styleName='image' linked />
      <PostTags tags={post.tags} />
      <PostBody title={post.title}
        id={post.id}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug}
        expanded
        styleName='body'
        fileAttachments={post.fileAttachments} />
      <PostCommunities
        communities={post.communities}
        slug={slug}
        showBottomBorder />
      <JoinProjectButton joinProject={joinProject} leaveProject={leaveProject} leaving={isMember} />
      <div styleName='activity-header' ref={this.setActivityStateFromDOM}>ACTIVITY</div>
      <PostFooter id={post.id}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote}
        type={post.type}
        members={post.members || []} />
      {atActivity && <div styleName='activity-sticky' style={activityStyle}>
        <div styleName='activity-header'>ACTIVITY</div>
        <PostFooter id={post.id}
          commenters={post.commenters}
          commentersTotal={post.commentersTotal}
          votesTotal={post.votesTotal}
          myVote={post.myVote} />
      </div>}
      <Comments postId={post.id} slug={slug} scrollToBottom={scrollToBottom} />
      <SocketSubscriber type='post' id={post.id} />
    </div>
  }
}

function WrappedPostHeader ({post, onClose, slug}) {
  return <PostHeader creator={post.creator}
    date={post.createdAt}
    type={post.type}
    communities={post.communities}
    close={onClose}
    slug={slug}
    pinned={post.pinned}
    topics={post.topics}
    styleName='header'
    id={post.id}
    topicsOnNewline
    announcement={post.announcement}
  />
}

export function PostTags ({ tags, slug }) {
  if (isEmpty(tags)) return null

  return <div styleName='tags'>
    {tags.map(tag => <Link styleName='tag' to={tagUrl(tag, slug)} key={tag}>
      #{tag}
    </Link>)}
  </div>
}

export function JoinProjectButton ({ leaving, joinProject, leaveProject }) {
  const buttonText = leaving ? 'Leave Project' : 'Join Project'
  const onClick = leaving ? leaveProject : joinProject

  return <Button
    color='purple'
    key='join-project-button'
    narrow
    onClick={onClick}
    styleName='join-project-button'>
    {buttonText}
  </Button>
}

