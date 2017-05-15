import React, { PropTypes, Component } from 'react'
import { Link } from 'react-router-dom'
import { isEmpty } from 'lodash/fp'
import './PostDetail.scss'
const { bool, func, object, string } = PropTypes
import { PostImage, PostBody, PostFooter, PostHeader } from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import Comments from './Comments'
import { tagUrl } from 'util/index'
import { DETAIL_COLUMN_ID } from 'util/scrolling'
import WebsocketSubscriber from 'components/WebsocketSubscriber'

const STICKY_HEADER_ID = 'header-sticky'
const STICKY_ACTIVITY_ID = 'activity-sticky'

export default class PostDetail extends Component {
  static propTypes = {
    post: object,
    id: string,
    slug: string,
    fetchPost: func,
    showCommunity: bool
  }

  constructor (props) {
    super(props)
    this.state = {
      atTop: true,
      atActivity: false
    }
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

  handleScroll = event => {
    const { atTop, atActivity } = this.state
    const header = document.getElementById(STICKY_HEADER_ID)
    if (!atTop) {
      header.style.top = event.target.scrollTop + 'px'
    }
    const activityBreakpoint = this.refs.activity.offsetTop - header.offsetHeight
    if (event.target.scrollTop >= activityBreakpoint && !atActivity) {
      this.setState({atActivity: true})
      const activity = document.getElementById(STICKY_ACTIVITY_ID)
      if (activity) activity.style.top = event.target.scrollTop + header.offsetHeight + 'px'
    } else if (event.target.scrollTop < activityBreakpoint && atActivity) {
      this.setState({atActivity: false})
    }
    if (atActivity) {
      const activity = document.getElementById(STICKY_ACTIVITY_ID)
      if (activity) activity.style.top = event.target.scrollTop + header.offsetHeight + 'px'
    }
  }

  render () {
    const { post, slug, onClose, showCommunity } = this.props
    const { atTop, atActivity } = this.state
    if (!post) return null

    const scrollToBottom = () => {
      const detail = document.getElementById(DETAIL_COLUMN_ID)
      detail.scrollTop = detail.scrollHeight
    }

    const header = <PostHeader creator={post.creator}
      date={post.updatedAt || post.createdAt}
      type={post.type}
      communities={post.communities}
      showCommunity={showCommunity}
      close={onClose}
      slug={slug}
      styleName='header' />

    return <div styleName='post'>
      <ScrollListener elementId={DETAIL_COLUMN_ID}
        onScroll={this.handleScroll}
        onTop={() => this.setState({atTop: true})}
        onLeaveTop={() => this.setState({atTop: false})} />
      {header}
      {!atTop && <div id={STICKY_HEADER_ID} styleName='header-sticky'>{header}</div>}
      <PostImage imageUrl={post.imageUrl} styleName='image' />
      <PostTags tags={post.tags} />
      <PostBody title={post.title}
        id={post.id}
        details={post.details}
        linkPreview={post.linkPreview}
        slug={slug}
        expanded
        styleName='body' />
      <div styleName='activity-header' ref='activity'>Activity</div>
      <PostFooter id={post.id}
        commenters={post.commenters}
        commentersTotal={post.commentersTotal}
        votesTotal={post.votesTotal}
        myVote={post.myVote} />
      {atActivity && <div id={STICKY_ACTIVITY_ID} styleName='activity-sticky'>
        <div styleName='activity-header'>Activity</div>
        <PostFooter id={post.id}
          commenters={post.commenters}
          commentersTotal={post.commentersTotal}
          votesTotal={post.votesTotal}
          myVote={post.myVote} />
      </div>}
      <Comments postId={post.id} slug={slug} scrollToBottom={scrollToBottom} />
      <WebsocketSubscriber id={post.id} />
    </div>
  }
}

export function PostTags ({ tags, slug }) {
  if (isEmpty(tags)) return null

  return <div styleName='tags'>
    {tags.map(tag => <Link styleName='tag' to={tagUrl(tag, slug)} key={tag}>
      #{tag}
    </Link>)}
  </div>
}
