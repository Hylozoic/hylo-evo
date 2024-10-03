import React, { useState, useEffect, useRef, useMemo } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { useResizeDetector } from 'react-resize-detector'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import PropTypes from 'prop-types'
import { get, throttle, find } from 'lodash/fp'
import { Helmet } from 'react-helmet'
import { AnalyticsEvents, TextHelpers } from 'hylo-shared'
import { PROJECT_CONTRIBUTIONS } from 'config/featureFlags'
import { editPostUrl, removePostFromUrl } from 'util/navigation'
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
import fetchPost from 'store/actions/fetchPost'
import joinProject from 'store/actions/joinProject'
import leaveProject from 'store/actions/leaveProject'
import processStripeToken from 'store/actions/processStripeToken'
import respondToEvent from 'store/actions/respondToEvent'
import trackAnalyticsEvent from 'store/actions/trackAnalyticsEvent'
import { FETCH_POST } from 'store/constants'
import presentPost from 'store/presenters/presentPost'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import { DETAIL_COLUMN_ID, position } from 'util/scrolling'

import classes from './PostDetail.module.scss'

// the height of the header plus the padding-top
const STICKY_HEADER_SCROLL_OFFSET = 70
const MAX_DETAILS_LENGTH = 144

function PostDetail() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const routeParams = useParams()
  const postId = routeParams.postId || getQuerystringParam('fromPostId', { location })
  const { groupSlug, commentId } = routeParams

  const currentGroup = useSelector(state => getGroupForSlug(state, groupSlug))
  const postSelector = useSelector(state => getPost(state, postId))
  const post = useMemo(() => {
    return postSelector ? presentPost(postSelector, get('id', currentGroup)) : null
  }, [postId, currentGroup])
  const currentUser = useSelector(getMe)
  const pending = useSelector(state => state.pending[FETCH_POST])
  const isProjectMember = find(({ id }) => id === get('id', currentUser), get('members', post))

  const [state, setState] = useState({
    atHeader: false,
    headerWidth: 0,
    headerScrollOffset: 0,
    atActivity: false,
    activityWidth: 0,
    activityScrollOffset: 0,
    showPeopleDialog: false
  })

  const activityHeader = useRef(null)
  const { t } = useTranslation()

  useEffect(() => {
    onPostIdChange()
  }, [postId])

  const handleSetComponentPositions = () => {
    const container = document.getElementById(DETAIL_COLUMN_ID)
    if (!container) return
    const element = activityHeader.current
    setState(prevState => ({
      ...prevState,
      headerWidth: container.offsetWidth,
      activityWidth: element ? element.offsetWidth : 0,
      activityScrollOffset: element ? position(element, container).y - STICKY_HEADER_SCROLL_OFFSET : 0
    }))
  }

  const { width, ref } = useResizeDetector({ handleHeight: false, onResize: handleSetComponentPositions })

  const onPostIdChange = () => {
    dispatch(fetchPost(postId))

    if (post) {
      dispatch(trackAnalyticsEvent(AnalyticsEvents.POST_OPENED, {
        postId: post.id,
        groupId: post.groups.map(g => g.id),
        isPublic: post.isPublic,
        topics: post.topics?.map(t => t.name),
        type: post.type
      }))
    }
  }

  const handleScroll = throttle(100, event => {
    const { scrollTop } = event.target
    const {
      atHeader,
      atActivity,
      headerScrollOffset,
      activityScrollOffset
    } = state
    setState(prevState => ({
      ...prevState,
      atActivity: !atActivity && scrollTop >= activityScrollOffset ? true : atActivity && scrollTop < activityScrollOffset ? false : atActivity,
      atHeader: !atHeader && scrollTop > headerScrollOffset ? true : atHeader && scrollTop <= headerScrollOffset ? false : atHeader
    }))
  })

  const togglePeopleDialog = () => setState(prevState => ({ ...prevState, showPeopleDialog: !prevState.showPeopleDialog }))

  const onClose = () => {
    const closeLocation = {
      ...location,
      pathname: removePostFromUrl(location.pathname) || '/'
    }
    navigate(closeLocation)
  }

  if (!post && !pending) return <NotFound />
  if (pending) return <Loading />

  const isProject = get('type', post) === 'project'
  const isEvent = get('type', post) === 'event'
  const isFlagged = post.flaggedGroups && post.flaggedGroups.includes(currentGroup.id)

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
    width: state.headerWidth + 'px'
  }
  const activityStyle = {
    width: state.activityWidth + 'px',
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
  const showPeopleDialog = hasPeople && state.showPeopleDialog
  const handleTogglePeopleDialog = hasPeople && togglePeopleDialog ? togglePeopleDialog : undefined

  const postFooter = (
    <PostFooter
      {...post}
      currentUser={currentUser}
    />
  )

  return (
    <div ref={ref} className={cx(classes.post, { [classes.noUser]: !currentUser, [classes.headerPad]: state.atHeader })}>
      <Helmet>
        <title>
          {`${post.title || TextHelpers.presentHTMLToText(post.details, { truncate: 20 })} | Hylo`}
        </title>
        <meta name='description' content={TextHelpers.presentHTMLToText(post.details, { truncate: MAX_DETAILS_LENGTH })} />
      </Helmet>
      <ScrollListener elementId={DETAIL_COLUMN_ID} onScroll={handleScroll} />
      <PostHeader
        className={classes.header}
        {...post}
        routeParams={{ groupSlug, postId, commentId }}
        close={onClose}
        expanded
        isFlagged={isFlagged}
        detailHasImage={detailHasImage}
      />
      {state.atHeader && (
        <div className={cx(classes.headerSticky, { [classes.atActivity]: state.atActivity })} style={headerStyle}>
          <PostHeader
            className={classes.header}
            currentUser={currentUser}
            {...post}
            routeParams={{ groupSlug, postId, commentId }}
            close={onClose}
            isFlagged={isFlagged}
          />
        </div>
      )}
      <CardImageAttachments attachments={post.attachments} />
      {isEvent && (
        <EventBody
          className={classes.body}
          expanded
          currentUser={currentUser}
          slug={groupSlug}
          event={post}
          respondToEvent={(response) => dispatch(respondToEvent(post, response))}
          togglePeopleDialog={handleTogglePeopleDialog}
          isFlagged={isFlagged}
        />
      )}
      {!isEvent && (
        <PostBody
          currentUser={currentUser}
          className={classes.body}
          expanded
          routeParams={{ groupSlug, postId, commentId }}
          slug={groupSlug}
          isFlagged={isFlagged}
          {...post}
        />
      )}
      {isProject && currentUser && (
        <div className={classes.projectActionsWrapper}>
          <div className={classes.joinProjectButtonContainer}>
            <JoinProjectSection
              currentUser={currentUser}
              joinProject={() => dispatch(joinProject(postId))}
              leaveProject={() => dispatch(leaveProject(postId))}
              leaving={isProjectMember}
              members={post.members}
              togglePeopleDialog={handleTogglePeopleDialog}
            />
          </div>
          {post.projectManagementLink && projectManagementTool && (
            <div className={classes.projectManagementTool}>
              <div>{t('This project is being managed on')} <img src={`/assets/pm-tools/${projectManagementTool}.svg`} /></div>
              <div><a className={classes.joinProjectButton} href={post.projectManagementLink} target='_blank'>{t('View tasks')}</a></div>
            </div>
          )}
          {post.projectManagementLink && !projectManagementTool && (
            <div className={classes.projectManagementTool}>
              <div>{t('View project management tool')}</div>
              <div><a className={classes.joinProjectButton} href={post.projectManagementLink} target='_blank'>{t('View tasks')}</a></div>
            </div>
          )}
          {post.donationsLink && donationService && (
            <div className={classes.donate}>
              <div>{t('Support this project on')} <img src={`/assets/payment-services/${donationService}.svg`} /></div>
              <div><a className={classes.joinProjectButton} href={post.donationsLink} target='_blank'>{t('Contribute')}</a></div>
            </div>
          )}
          {post.donationsLink && !donationService && (
            <div className={classes.donate}>
              <div>{t('Support this project')}</div>
              <div><a className={classes.joinProjectButton} href={post.donationsLink} target='_blank'>{t('Contribute')}</a></div>
            </div>
          )}
        </div>
      )}
      {isProject && acceptContributions && currentUser.hasFeature(PROJECT_CONTRIBUTIONS) && (
        <ProjectContributions
          postId={post.id}
          totalContributions={totalContributions}
          processStripeToken={(token, amount) => dispatch(processStripeToken(postId, token, amount))}
        />
      )}
      <PostGroups
        isPublic={post.isPublic}
        groups={post.groups}
        slug={groupSlug}
        showBottomBorder
      />
      {postFooter}
      <div ref={activityHeader} />
      {state.atActivity && (
        <div className={classes.activitySticky} style={activityStyle}>
          {postFooter}
        </div>
      )}
      <Comments
        post={post}
        slug={groupSlug}
        selectedCommentId={commentId}
        scrollToBottom={scrollToBottom}
      />
      {showPeopleDialog && (
        <PostPeopleDialog
          currentGroup={currentGroup}
          title={postPeopleDialogTitle}
          members={people}
          onClose={handleTogglePeopleDialog}
          slug={groupSlug}
        />
      )}
      <SocketSubscriber type='post' id={post.id} />
    </div>
  )
}

PostDetail.propTypes = {
  currentUser: PropTypes.object,
  fetchPost: PropTypes.func,
  post: PropTypes.object,
  routeParams: PropTypes.object
}

export function JoinProjectSection ({ currentUser, members, leaving, joinProject, leaveProject, togglePeopleDialog }) {
  const { t } = useTranslation()
  const buttonText = leaving ? t('Leave Project') : t('Join Project')
  const onClick = () => leaving ? leaveProject() : joinProject()

  return (
    <div className={classes.joinProject}>
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
        className={classes.joinProjectButton}
      >
        {buttonText}
      </Button>
    </div>
  )
}

export default PostDetail
