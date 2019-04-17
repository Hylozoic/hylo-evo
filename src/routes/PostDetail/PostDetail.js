import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { get, throttle, isEmpty } from 'lodash/fp'
import { tagUrl } from 'util/navigation'
import { DETAIL_COLUMN_ID, position } from 'util/scrolling'
import { PROJECT_CONTRIBUTIONS } from 'config/featureFlags'
import {
  PostImage,
  PostBody,
  PostFooter,
  PostHeader,
  PostCommunities,
  EventBody
} from 'components/PostCard'
import ScrollListener from 'components/ScrollListener'
import Comments from './Comments'
import SocketSubscriber from 'components/SocketSubscriber'
import Button from 'components/Button'
import Loading from 'components/Loading'
import NotFound from 'components/NotFound'
import ProjectContributions from './ProjectContributions'
import PostPeopleDialog from 'components/PostPeopleDialog'
import './PostDetail.scss'

// the height of the header plus the padding-top
const STICKY_HEADER_SCROLL_OFFSET = 78

export default class PostDetail extends Component {
  static propTypes = {
    post: PropTypes.object,
    routeParams: PropTypes.object,
    currentUser: PropTypes.object,
    fetchPost: PropTypes.func
  }

  state = {
    atHeader: false,
    headerWidth: 0,
    headerScrollOffset: 0,
    atActivity: false,
    activityWidth: 0,
    activityScrollOffset: 0,
    showPeopleDialog: false
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
      this.setState({ atActivity: true })
    } else if (atActivity && scrollTop < activityScrollOffset) {
      this.setState({ atActivity: false })
    }

    if (!atHeader && scrollTop > headerScrollOffset) {
      this.setState({ atHeader: true })
    } else if (atHeader && scrollTop <= headerScrollOffset) {
      this.setState({ atHeader: false })
    }
  })

  togglePeopleDialog = () => this.setState(state => ({ showPeopleDialog: !state.showPeopleDialog }))

  render () {
    const {
      routeParams,
      post,
      voteOnPost,
      isProjectMember,
      joinProject,
      leaveProject,
      pending,
      processStripeToken,
      currentUser,
      respondToEvent
    } = this.props
    const { atHeader, atActivity, headerWidth, activityWidth } = this.state

    if (!post && !pending) return <NotFound />
    if (pending) return <Loading />

    const isProject = get('type', post) === 'project'
    const isEvent = get('type', post) === 'event'

    const { acceptContributions, totalContributions } = post || {}

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

    var people, postPeopleDialogTitle
    if (isProject) {
      people = post.members
      postPeopleDialogTitle = 'Project Members'
    } else if (isEvent) {
      people = post.eventInvitations
      postPeopleDialogTitle = 'Responses'
    }

    const hasPeople = people && people.length > 0
    let { showPeopleDialog } = this.state
    showPeopleDialog = hasPeople && showPeopleDialog
    const togglePeopleDialog = hasPeople && this.togglePeopleDialog ? this.togglePeopleDialog : undefined
    const postFooter = <PostFooter
      {...post}
      voteOnPost={voteOnPost}
      onClick={togglePeopleDialog} />

    return <div styleName='post' ref={this.setHeaderStateFromDOM}>
      <ScrollListener elementId={DETAIL_COLUMN_ID} onScroll={this.handleScroll} />
      <PostHeader styleName='header' topicsOnNewline {...post} routeParams={routeParams} />
      {atHeader && <div styleName='header-sticky' style={headerStyle}>
        <PostHeader styleName='header' topicsOnNewline {...post} routeParams={routeParams} />
      </div>}
      <PostImage postId={post.id} styleName='image' linked />
      <PostTags tags={post.tags} />
      {isEvent && <EventBody
        styleName='body'
        expanded
        slug={routeParams.slug}
        event={post}
        respondToEvent={respondToEvent} />}
      {!isEvent && <PostBody
        styleName='body'
        expanded
        slug={routeParams.slug}
        post={post} />}
      {isProject && <div styleName='join-project-button-container'>
        <JoinProjectButton
          joinProject={joinProject}
          leaveProject={leaveProject}
          leaving={isProjectMember} />
      </div>}
      {isProject && acceptContributions && currentUser.hasFeature(PROJECT_CONTRIBUTIONS) &&
        <ProjectContributions
          postId={post.id}
          totalContributions={totalContributions}
          processStripeToken={processStripeToken} />}
      <PostCommunities
        communities={post.communities}
        slug={routeParams.slug}
        showBottomBorder />
      <div styleName='activity-header' ref={this.setActivityStateFromDOM}>ACTIVITY</div>
      {postFooter}
      {showPeopleDialog && <PostPeopleDialog
        title={postPeopleDialogTitle}
        members={people}
        onClose={togglePeopleDialog} />}
      {atActivity && <div styleName='activity-sticky' style={activityStyle}>
        <div styleName='activity-header'>ACTIVITY</div>
        {postFooter}
      </div>}
      <Comments postId={post.id} slug={routeParams.slug} scrollToBottom={scrollToBottom} />
      <SocketSubscriber type='post' id={post.id} />
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

export function JoinProjectButton ({ leaving, joinProject, leaveProject }) {
  const buttonText = leaving ? 'Leave Project' : 'Join Project'
  const onClick = () => leaving ? leaveProject() : joinProject()

  return <Button
    color='green'
    key='join-project-button'
    narrow
    onClick={onClick}
    styleName='join-project-button'>
    {buttonText}
  </Button>
}
