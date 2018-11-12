import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { get, pick, throttle, isEmpty } from 'lodash/fp'
import { tagUrl } from 'util/navigation'
import { DETAIL_COLUMN_ID, position } from 'util/scrolling'
import { PostImage, PostBody, PostFooter, PostHeader, PostCommunities } from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import Comments from './Comments'
import SocketSubscriber from 'components/SocketSubscriber'
import Button from 'components/Button'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import ProjectMembersDialog from 'components/ProjectMembersDialog'
import './PostDetail.scss'

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

  state = {
    atHeader: false,
    headerWidth: 0,
    headerScrollOffset: 0,
    atActivity: false,
    activityWidth: 0,
    activityScrollOffset: 0,
    showMembersDialog: false
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

  toggleMembersDialog = () => this.setState(state => ({showMembersDialog: !state.showMembersDialog}))

  render () {
    const {
      post,
      slug,
      voteOnPost,
      isProjectMember,
      joinProject,
      leaveProject,
      pending
    } = this.props
    const { atHeader, atActivity, headerWidth, activityWidth } = this.state

    if (!post && !pending) return <NotFound />
    if (pending) return <Loading />

    const isProject = get('type', post) === 'project'
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
    const hasMembers = post.members.length > 0
    let { showMembersDialog } = this.state
    showMembersDialog = hasMembers && showMembersDialog
    const toggleMembersDialog = hasMembers && this.toggleMembersDialog ? this.toggleMembersDialog : undefined
    const postFooter = <PostFooter
      {...pick([
        'myVote',
        'votesTotal',
        'commenters',
        'commentersTotal',
        'type',
        'members'
      ], post)}
      voteOnPost={voteOnPost}
      postId={post.id}
      onClick={toggleMembersDialog} />

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
      {isProject && <div styleName='join-project-button-container'>
        <JoinProjectButton
          joinProject={joinProject}
          leaveProject={leaveProject}
          leaving={isProjectMember}
          postId={post.id} />
      </div>}
      <PostCommunities
        communities={post.communities}
        slug={slug}
        showBottomBorder />
      <div styleName='activity-header' ref={this.setActivityStateFromDOM}>ACTIVITY</div>
      {postFooter}
      {showMembersDialog && <ProjectMembersDialog
        members={post.members}
        onClose={toggleMembersDialog} />}
      {atActivity && <div styleName='activity-sticky' style={activityStyle}>
        <div styleName='activity-header'>ACTIVITY</div>
        {postFooter}
      </div>}
      <Comments postId={post.id} slug={slug} scrollToBottom={scrollToBottom} />
      <SocketSubscriber type='post' id={post.id} />
    </div>
  }
}

function WrappedPostHeader (props) {
  const headerProps = {
    date: props.post.createdAt,
    ...pick([
      'id',
      'creator',
      'type',
      'communities',
      'pinned',
      'topics',
      'announcement'
    ], props.post),
    ...pick([
      'personId',
      'slug',
      'networkSlug',
      'postTypeContext'
    ], props)
  }
  return <PostHeader styleName='header' topicsOnNewline {...headerProps} />
}

export function PostTags ({ tags, slug }) {
  if (isEmpty(tags)) return null

  return <div styleName='tags'>
    {tags.map(tag => <Link styleName='tag' to={tagUrl(tag, slug)} key={tag}>
      #{tag}
    </Link>)}
  </div>
}

export function JoinProjectButton ({ leaving, joinProject, leaveProject, postId }) {
  const buttonText = leaving ? 'Leave Project' : 'Join Project'
  const onClick = () => leaving ? leaveProject(postId) : joinProject(postId)

  return <Button
    color='green'
    key='join-project-button'
    narrow
    onClick={onClick}
    styleName='join-project-button'>
    {buttonText}
  </Button>
}
