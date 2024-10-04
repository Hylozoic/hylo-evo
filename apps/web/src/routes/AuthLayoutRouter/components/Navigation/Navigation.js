import cx from 'classnames'
import { compact, get } from 'lodash/fp'
import React from 'react'
import { Link, useParams, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSelector, useDispatch } from 'react-redux'
import { createSelector as ormCreateSelector } from 'redux-orm'
import Icon from 'components/Icon'
import NavLink from './NavLink'
import TopicNavigation from './TopicNavigation'
import { toggleGroupMenu } from 'routes/AuthLayoutRouter/AuthLayoutRouter.store'
import { GROUP_TYPES } from 'store/models/Group'
import getGroupForSlug from 'store/selectors/getGroupForSlug'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import getMe from 'store/selectors/getMe'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { CONTEXT_MY,FETCH_POSTS } from 'store/constants'
import orm from 'store/models'
import { makeDropQueryResults } from 'store/reducers/queryResults'
import { topicsUrl, baseUrl, viewUrl } from 'util/navigation'

import classes from './Navigation.module.scss'

const getGroupMembership = ormCreateSelector(
  orm,
  getMe,
  (state, { groupId }) => groupId,
  (session, currentUser, id) => session.Membership.filter({ group: id, person: currentUser }).first()
)

export default function Navigation (props) {
  const {
    className,
    collapsed,
    groupId,
    hideTopics,
    mapView,
    toggleGroupMenu
  } = props

  const dispatch = useDispatch()
  const routeParams = useParams()
  const location = useLocation()
  const { t } = useTranslation()

  const group = useSelector(state => getGroupForSlug(state, routeParams.groupSlug))
  const rootPath = baseUrl({ ...routeParams, view: null })
  const isAllOrPublicPath = ['/all', '/public'].includes(rootPath)

  const badge = useSelector(state => {
    if (group) {
      const groupMembership = getGroupMembership(state, { groupId: group.id })
      return get('newPostCount', groupMembership)
    }
    return null
  })

  const hasRelatedGroups = useSelector(state => {
    if (group) {
      const childGroups = getChildGroups(state, group)
      const parentGroups = getParentGroups(state, group)
      return childGroups.length > 0 || parentGroups.length > 0
    }
    return false
  })

  const isGroupMenuOpen = useSelector(state => get('AuthLayoutRouter.isGroupMenuOpen', state))
  const streamFetchPostsParam = useSelector(state => get('Stream.fetchPostsParam', state))

  const dropPostResults = makeDropQueryResults(FETCH_POSTS)

  const clearStream = () => dispatch(dropPostResults(streamFetchPostsParam))
  const clearBadge = () => {
    if (badge && group) {
      dispatch(resetNewPostCount(group.id, 'Membership'))
    }
  }

  const homeOnClick = () => {
    if (window.location.pathname === rootPath) {
      clearStream()
      clearBadge()
    }
  }

  const createPath = `${location.pathname}/create${location.search}`
  const eventsPath = viewUrl('events', routeParams)
  const explorePath = !isAllOrPublicPath && viewUrl('explore', routeParams)
  const groupsPath = viewUrl('groups', routeParams)
  const streamPath = viewUrl('stream', routeParams)
  const mapPath = viewUrl('map', routeParams)
  const membersPath = !isAllOrPublicPath && viewUrl('members', routeParams)
  const projectsPath = viewUrl('projects', routeParams)
  const proposalPath = viewUrl('proposals', routeParams)

  const isPublic = routeParams.context === 'public'
  const isMyContext = routeParams.context === CONTEXT_MY

  const customViews = (group && group.customViews && group.customViews.toRefArray()) || []

  const myLinks = [
    createPath && {
      label: t('Create'),
      icon: 'Create',
      to: createPath
    },
    {
      label: t('My Posts'),
      icon: 'Posticon',
      to: '/my/posts'
    },
    {
      label: t('Interactions'),
      icon: 'Support',
      to: '/my/interactions'
    },
    {
      label: t('Mentions'),
      icon: 'Email',
      to: '/my/mentions'
    },
    {
      label: t('Announcements'),
      icon: 'Announcement',
      to: '/my/announcements'
    }
  ]

  const regularLinks = compact([
    createPath && {
      label: t('Create'),
      icon: 'Create',
      to: createPath
    },
    rootPath && {
      label: group && group.type === GROUP_TYPES.farm ? t('Home') : t('Stream'),
      icon: group && group.type === GROUP_TYPES.farm ? 'Home' : 'Stream',
      to: rootPath,
      badge,
      handleClick: homeOnClick,
      exact: true
    },
    streamPath && group && group.type === GROUP_TYPES.farm && {
      label: t('Stream'),
      icon: 'Stream',
      to: streamPath
    },
    explorePath && group && group.type !== GROUP_TYPES.farm && {
      label: t('Explore'),
      icon: 'Binoculars',
      to: explorePath
    },
    projectsPath && {
      label: t('Projects'),
      icon: 'Projects',
      to: projectsPath
    },
    eventsPath && {
      label: t('Events'),
      icon: 'Events',
      to: eventsPath
    },
    membersPath && {
      label: t('Members'),
      icon: 'People',
      to: membersPath
    },
    proposalPath && {
      label: t('Decisions'),
      icon: 'Proposal',
      to: proposalPath
    },
    (hasRelatedGroups || isPublic) && groupsPath && {
      label: isPublic ? t('Group Explorer') : t('Groups'),
      icon: 'Groups',
      to: groupsPath
    },
    mapPath && {
      label: t('Map'),
      icon: 'Globe',
      to: mapPath
    },
    ...customViews.filter(cv => cv.name && (cv.type !== 'externalLink' || cv.externalLink)).map(cv => ({
      label: cv.name,
      icon: cv.icon,
      to: cv.type !== 'externalLink' ? `${rootPath}/custom/${cv.id}` : false,
      externalLink: cv.type === 'externalLink' ? cv.externalLink : false
    }))
  ])

  const collapserState = collapsed ? 'collapserCollapsed' : 'collapser'
  const canView = !group || group.memberCount !== 0
  const links = isMyContext ? myLinks : regularLinks
  return (
    <div className={cx(classes.container, { [classes.mapView]: mapView }, classes[collapserState], { [classes.showGroupMenu]: isGroupMenuOpen }, className)}>
      <div className={classes.navigation}>
        {canView && (
          <ul className={classes.links} id='groupMenu'>
            {links.map((link, i) => (
              <NavLink
                key={link.label + i}
                externalLink={link.externalLink}
                {...link}
                collapsed={collapsed}
                onClick={link.handleClick}
              />
            ))}
            <li className={cx(classes.item, classes.topicItem)}>
              <Link to={topicsUrl(routeParams)}>
                <Icon name='Topics' />
              </Link>
            </li>
          </ul>
        )}
        {!hideTopics && canView && !isMyContext && (
          <TopicNavigation
            collapsed={collapsed}
            backUrl={rootPath}
            routeParams={routeParams}
            groupId={groupId}
            location={location}
          />
        )}
      </div>
      <div className={classes.closeBg} onClick={toggleGroupMenu} />
    </div>
  )
}
