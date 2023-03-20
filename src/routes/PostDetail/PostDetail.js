import React, { Component } from 'react'
import ReactResizeDetector from 'react-resize-detector'
import { withTranslation, useTranslation } from 'react-i18next'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { get, throttle } from 'lodash/fp'
import { Helmet } from 'react-helmet'
import { AnalyticsEvents, TextHelpers } from 'hylo-shared'
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
import PeopleInfo from 'components/PostCard/PeopleInfo'
import ProjectContributions from './ProjectContributions'
import PostPeopleDialog from 'components/PostPeopleDialog'
import './PostDetail.scss'

// the height of the header plus the padding-top
const STICKY_HEADER_SCROLL_OFFSET = 70
const MAX_DETAILS_LENGTH = 144
class PostDetail extends Component {
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

  handleSetComponentPositions = () => {
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

    const post = this.props.post
    if (post) {
      this.props.trackAnalyticsEvent(AnalyticsEvents.POST_OPENED, {
        postId: post.id,
        groupId: post.groups.map(g => g.id),
        isPublic: post.isPublic,
        topics: post.topics?.map(t => t.name),
        type: post.type
      })
    }
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
      currentGroup,
      currentUser,
      joinProject,
      isProjectMember,
      leaveProject,
      pending,
      post,
      processStripeToken,
      respondToEvent,
      routeParams,
      onClose,
      t
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

    let people, postPeopleDialogTitle

    if (isProject) {
      people = post.members
      postPeopleDialogTitle = t('Project Members')
    } else if (isEvent) {
      people = post.eventInvitations
      postPeopleDialogTitle = t('Responses')
    }

    const detailHasImage = post.attachments.find(a => a.type === 'image') || false
    const hasPeople = people && people.length > 0
    const showPeopleDialog = hasPeople && this.state.showPeopleDialog
    const togglePeopleDialog = hasPeople && this.togglePeopleDialog ? this.togglePeopleDialog : undefined

    const postFooter = (
      <PostFooter
        {...post}
        currentUser={currentUser}
      />
    )

    return (
      <ReactResizeDetector handleWidth handleHeight={false} onResize={this.handleSetComponentPositions}>
        {({ width, height }) =>
          <div styleName={cx('post', { noUser: !currentUser, headerPad: atHeader })}>
            <Helmet>
              <title>
                {`${post.title || TextHelpers.presentHTMLToText(post.details, { truncate: 20 })} | Hylo`}
              </title>
              <meta name='description' content={TextHelpers.presentHTMLToText(post.details, { truncate: MAX_DETAILS_LENGTH })} />
            </Helmet>
            <ScrollListener elementId={DETAIL_COLUMN_ID} onScroll={this.handleScroll} />
            <PostHeader
              styleName='header'
              {...post}
              routeParams={routeParams}
              close={onClose}
              expanded
              detailHasImage={detailHasImage}
            />
            {atHeader && (
              <div styleName={cx('header-sticky', { 'at-activity': atActivity })} style={headerStyle}>
                <PostHeader
                  styleName='header'
                  currentUser={currentUser}
                  {...post}
                  routeParams={routeParams}
                  close={onClose}
                />
              </div>
            )}
            <CardImageAttachments attachments={post.attachments} linked />
            {isEvent && (
              <EventBody
                styleName='body'
                expanded
                currentUser={currentUser}
                slug={routeParams.groupSlug}
                event={post}
                respondToEvent={respondToEvent}
                togglePeopleDialog={togglePeopleDialog}
              />
            )}
            {!isEvent && (
              <PostBody
                currentUser={currentUser}
                styleName='body'
                expanded
                routeParams={routeParams}
                slug={routeParams.groupSlug}
                {...post}
              />
            )}
            {isProject && currentUser && (
              <div styleName='project-actions-wrapper'>
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
                {post.projectManagementLink && projectManagementTool && (
                  <div styleName='project-management-tool'>
                    <div>{t('This project is being managed on')} <img src={`/assets/pm-tools/${projectManagementTool}.svg`} /></div>
                    <div><a styleName='join-project-button' href={post.projectManagementLink} target='_blank'>{t('View tasks')}</a></div>
                  </div>
                )}
                {post.projectManagementLink && !projectManagementTool && (
                  <div styleName='project-management-tool'>
                    <div>{t('View project management tool')}</div>
                    <div><a styleName='join-project-button' href={post.projectManagementLink} target='_blank'>{t('View tasks')}</a></div>
                  </div>
                )}
                {post.donationsLink && donationService && (
                  <div styleName='donate'>
                    <div>{t('Support this project on')} <img src={`/assets/payment-services/${donationService}.svg`} /></div>
                    <div><a styleName='join-project-button' href={post.donationsLink} target='_blank'>{t('Contribute')}</a></div>
                  </div>
                )}
                {post.donationsLink && !donationService && (
                  <div styleName='donate'>
                    <div>{t('Support this project')}</div>
                    <div><a styleName='join-project-button' href={post.donationsLink} target='_blank'>{t('Contribute')}</a></div>
                  </div>
                )}
              </div>
            )}
            {isProject && acceptContributions && currentUser.hasFeature(PROJECT_CONTRIBUTIONS) && (
              <ProjectContributions
                postId={post.id}
                totalContributions={totalContributions}
                processStripeToken={processStripeToken}
              />
            )}
            <PostGroups
              isPublic={post.isPublic}
              groups={post.groups}
              slug={routeParams.groupSlug}
              showBottomBorder
            />
            {postFooter}
            <div ref={this.activityHeader} />
            {atActivity && (
              <div styleName='activity-sticky' style={activityStyle}>
                {postFooter}
              </div>
            )}
            <Comments
              post={post}
              slug={routeParams.groupSlug}
              selectedCommentId={routeParams.commentId}
              scrollToBottom={scrollToBottom}
            />
            {showPeopleDialog && (
              <PostPeopleDialog
                currentGroup={currentGroup}
                title={postPeopleDialogTitle}
                members={people}
                onClose={togglePeopleDialog}
                slug={routeParams.groupSlug}
              />
            )}
            <SocketSubscriber type='post' id={post.id} />
          </div>}
      </ReactResizeDetector>
    )
  }
}

export function JoinProjectSection ({ currentUser, members, leaving, joinProject, leaveProject, togglePeopleDialog }) {
  const { t } = this.props
  const buttonText = leaving ? t('Leave Project') : t('Join Project')
  const onClick = () => leaving ? leaveProject() : joinProject()

  return (
    <div styleName='join-project'>
      <PeopleInfo
        people={members}
        peopleTotal={members.length}
        excludePersonId={get('id', currentUser)}
        onClick={togglePeopleDialog}
        phrases={{
          emptyMessage: t('No project members'),
          phraseSingular: t('is a member'),
          mePhraseSingular: t('are a member'),
          pluralPhrase: t('are members')
        }}
      />
      <Button
        key='join-project-button'
        onClick={onClick}
        styleName='join-project-button'
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default withTranslation()(PostDetail)
