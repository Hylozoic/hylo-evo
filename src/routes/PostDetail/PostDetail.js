import React, { PropTypes, Component } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { throttle, isEmpty } from 'lodash/fp'
import './PostDetail.scss'
const { bool, func, object, string } = PropTypes
import { PostImage, PostBody, PostFooter, PostHeader } from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import Comments from './Comments'
import { tagUrl } from 'util/index'
import { DETAIL_COLUMN_ID, position } from 'util/scrolling'
import SocketSubscriber from 'components/SocketSubscriber'
import Loading from 'components/Loading'

// the height of the header plus the padding-top
const STICKY_HEADER_SCROLL_OFFSET = 78

export default class PostDetail extends Component {
  static propTypes = {
    post: object,
    id: string,
    currentUser: object,
    slug: string,
    fetchPost: func,
    showCommunity: bool,
    editPost: func
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
    const { post, slug, canEdit, pending } = this.props
    const { atHeader, atActivity, headerWidth, activityWidth } = this.state

    if (!post && !pending) {
      return <div styleName='not-found'>Oops, we were unable to find that post</div>
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
      <WrappedPostHeader {...this.props} canEdit={canEdit} />
      {atHeader && <div styleName='header-sticky' style={headerStyle}>
        <WrappedPostHeader {...this.props} canEdit={canEdit} />
      </div>}
      <PostImage imageUrl={post.imageUrl} styleName='image' />
      <PostTags tags={post.tags} />
      <PostBody title={post.title}
        id={post.id}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug}
        expanded
        styleName='body' />
      <div styleName='activity-header' ref={this.setActivityStateFromDOM}>Activity</div>
      <PostFooter id={post.id}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote} />
      {atActivity && <div styleName='activity-sticky' style={activityStyle}>
        <div styleName='activity-header'>Activity</div>
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

function WrappedPostHeader ({post, showCommunity, canEdit, editPost, onClose, slug}) {
  return <PostHeader creator={post.creator}
    date={post.updatedAt || post.createdAt}
    type={post.type}
    communities={post.communities}
    showCommunity={showCommunity}
    editPost={canEdit && editPost}
    close={onClose}
    slug={slug}
    styleName='header'
    id={post.id} />
}

export function PostTags ({ tags, slug }) {
  if (isEmpty(tags)) return null

  return <div styleName='tags'>
    {tags.map(tag => <Link styleName='tag' to={tagUrl(tag, slug)} key={tag}>
      #{tag}
    </Link>)}
  </div>
}
