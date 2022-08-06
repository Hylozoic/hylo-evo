import cx from 'classnames'
import React, { Component } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { get, throttle, isEmpty } from 'lodash/fp'
import { topicUrl } from 'util/navigation'
import { DETAIL_COLUMN_ID, position } from 'util/scrolling'
import { PROJECT_CONTRIBUTIONS } from 'config/featureFlags'
import CardImageAttachments from 'components/CardImageAttachments'
import {
  PostBody,
  PostFooter,
  PostHeader,
  PostGroups,
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
import { PeopleInfo } from 'components/PostCard/PostFooter/PostFooter'
import './PostDetail.scss'

// the height of the header plus the padding-top
const STICKY_HEADER_SCROLL_OFFSET = 69

export default class PostDetail extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    fetchPost: PropTypes.func,
    post: PropTypes.object,
    routeParams: PropTypes.object
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

  constructor (props) {
    super(props)
    this.activityHeader = React.createRef()
  }

  componentDidMount () {
    this.onPostIdChange()
  }

  componentDidUpdate (prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.onPostIdChange()
    }
  }

  setComponentPositions = () => {
    const container = document.getElementById(DETAIL_COLUMN_ID)
    if (!container) return
    const element = this.activityHeader.current
    this.setState({
      headerWidth: container.offsetWidth,
      activityWidth: element ? element.offsetWidth : 0,
      activityScrollOffset: element ? position(element, container).y - STICKY_HEADER_SCROLL_OFFSET : 0
    })
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
      respondToEvent,
      onClose
    } = this.props
    const { atHeader, atActivity, headerWidth, activityWidth } = this.state

    if (!post && !pending) return <NotFound />
    if (pending) return <Loading />

    const isProject = get('type', post) === 'project'
    const isEvent = get('type', post) === 'event'

    const m = post.projectManagementLink ? post.projectManagementLink.match(/(asana|trello|airtable|clickup|confluence|teamwork|notion|wrike|zoho)/) : null
    const projectManagementTool = m ? m[1] : null

    const d = post.donationsLink ? post.donationsLink.match(/(cash|clover|gofundme|opencollective|paypal|squareup|venmo)/) : null
    const donationService = d ? d[1] : null

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
      currentUser={currentUser}
    />

    return <ReactResizeDetector handleWidth handleHeight={false} onResize={this.setComponentPositions}>{({ width, height }) =>
      <div styleName={cx('post', { 'noUser': !currentUser })}>
        <ScrollListener elementId={DETAIL_COLUMN_ID} onScroll={this.handleScroll} />
        <PostHeader styleName='header' topicsOnNewline {...post} routeParams={routeParams} close={onClose} expanded />
        {atHeader && <div styleName='header-sticky' style={headerStyle}>
          <PostHeader styleName='header' topicsOnNewline {...post} routeParams={routeParams} close={onClose} />
        </div>}
        <CardImageAttachments attachments={post.attachments} linked />
        <PostTags tags={post.tags} />
        {isEvent && <EventBody
          currentUser={currentUser}
          styleName='body'
          expanded
          slug={routeParams.groupSlug}
          event={post}
          togglePeopleDialog={togglePeopleDialog}
          respondToEvent={respondToEvent} />}
        {!isEvent && <PostBody
          styleName='body'
          expanded
          routeParams={routeParams}
          slug={routeParams.groupSlug}
          post={post}
        />}
        {isProject && <div>
          <div styleName='join-project-button-container'>
            <JoinProjectSection
              currentUser={currentUser}
              joinProject={joinProject}
              leaveProject={leaveProject}
              leaving={isProjectMember}
              members={post.members}
              togglePeopleDialog={togglePeopleDialog}
            />
          </div>
          {post.projectManagementLink && projectManagementTool &&
            <div styleName='project-management-tool'>
              <div>This project is being managed on <img src={`/assets/pm-tools/${projectManagementTool}.svg`} /></div>
              <div><a styleName='project-button' href={post.projectManagementLink} target='_blank'>View tasks</a></div>
            </div>}
          {post.projectManagementLink && !projectManagementTool &&
            <div>
              View project management tool {post.projectManagementLink}
            </div>}

          {post.donationsLink && donationService &&
            <div styleName='donate'>
              <div>Support this project on <img src={`/assets/payment-services/${donationService}.svg`} /></div>
              <div><a styleName='project-button' href={post.donationsLink} target='_blank'>Contribute</a></div>
            </div>}
          {post.donationsLink && !donationService &&
            <div>
              Contribute financially to this project at {post.donationsLink}
            </div>}
        </div>}
        {isProject && acceptContributions && currentUser.hasFeature(PROJECT_CONTRIBUTIONS) &&
          <ProjectContributions
            postId={post.id}
            totalContributions={totalContributions}
            processStripeToken={processStripeToken} />}
        <PostGroups
          isPublic={post.isPublic}
          groups={post.groups}
          slug={routeParams.groupSlug}
          showBottomBorder />
        <div styleName='activity-header' ref={this.activityHeader}>ACTIVITY</div>
        {postFooter}
        {showPeopleDialog && <PostPeopleDialog
          title={postPeopleDialogTitle}
          members={people}
          onClose={togglePeopleDialog}
          slug={routeParams.groupSlug} />}
        {atActivity && <div styleName='activity-sticky' style={activityStyle}>
          <div styleName='activity-header'>ACTIVITY</div>
          {postFooter}
        </div>}
        <Comments postId={post.id} slug={routeParams.groupSlug} scrollToBottom={scrollToBottom} />
        <SocketSubscriber type='post' id={post.id} />
      </div>
    }</ReactResizeDetector>
  }
}

export function PostTags ({ tags, slug }) {
  if (isEmpty(tags)) return null

  return <div styleName='tags'>
    {tags.map(tag => <Link styleName='tag' to={topicUrl(tag, { groupSlug: slug })} key={tag}>
      #{tag}
    </Link>)}
  </div>
}

export function JoinProjectSection ({ currentUser, members, leaving, joinProject, leaveProject, togglePeopleDialog }) {
  const buttonText = leaving ? 'Leave Project' : 'Join Project'
  const onClick = () => leaving ? leaveProject() : joinProject()

  return (
    <div styleName='join-project'>
      <PeopleInfo
        people={members}
        peopleTotal={members.length}
        excludePersonId={get('id', currentUser)}
        onClick={togglePeopleDialog}
        phrases={{
          emptyMessage: 'No project members',
          phraseSingular: 'is a member',
          mePhraseSingular: 'are a member',
          pluralPhrase: 'are members'
        }}
      />
      <Button
        key='join-project-button'
        onClick={onClick}
        styleName='project-button'>
        {buttonText}
      </Button>
    </div>
  )
}
