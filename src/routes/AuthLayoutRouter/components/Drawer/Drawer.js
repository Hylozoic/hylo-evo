import React from 'react'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { get } from 'lodash/fp'
import { useDispatch, useSelector } from 'react-redux'
import { bgImageStyle } from 'util/index'
import { contextSwitchingUrl, createGroupUrl, groupUrl } from 'util/navigation'
import {
  ALL_GROUPS_ID, ALL_GROUPS_AVATAR_PATH, DEFAULT_AVATAR,
  PUBLIC_CONTEXT_ID, PUBLIC_CONTEXT_AVATAR_PATH, GROUP_EXPLORER_ID, GROUP_EXPLORER_AVATAR_PATH, PUBLIC_MAP_ID, PUBLIC_MAP_AVATAR_PATH
} from 'store/models/Group'
import { toggleDrawer as toggleDrawerAction } from 'routes/AuthLayoutRouter/AuthLayoutRouter.store'
import getMyGroups from 'store/selectors/getMyGroups'
import getCanModerate from 'store/selectors/getCanModerate'
import Badge from 'components/Badge'
import Button from 'components/Button'
import Icon from 'components/Icon'
import cx from 'classnames'
import s from './Drawer.scss' // eslint-disable-line no-unused-vars

export const defaultContexts = [
  {
    id: PUBLIC_CONTEXT_ID,
    name: 'Public Stream',
    groups: [],
    context: 'public',
    explicitPath: '/public/',
    avatarUrl: PUBLIC_CONTEXT_AVATAR_PATH
  },
  {
    id: GROUP_EXPLORER_ID,
    name: 'Public Groups',
    groups: [],
    context: 'public',
    explicitPath: '/public/groups/',
    avatarUrl: GROUP_EXPLORER_AVATAR_PATH
  },
  {
    id: PUBLIC_MAP_ID,
    name: 'Public Map',
    groups: [],
    context: 'public',
    explicitPath: '/public/map/',
    avatarUrl: PUBLIC_MAP_AVATAR_PATH
  }
]

export const allMyGroups = {
  id: ALL_GROUPS_ID,
  name: 'All My Groups',
  groups: [],
  context: 'all',
  avatarUrl: ALL_GROUPS_AVATAR_PATH
}

export default function Drawer (props) {
  const history = useHistory()
  const currentLocation = useLocation()
  const dispatch = useDispatch()
  const groups = useSelector(getMyGroups)
  const canModerate = useSelector(state => props.group && getCanModerate(state, props))
  const routeParams = props.match.params
  const { group, className } = props

  const toggleDrawer = () => dispatch(toggleDrawerAction())

  const goToCreateGroup = () => {
    history.push(createGroupUrl(get('match.params', props)))
    return null
  }

  let bannerUrl

  if (!group) {
    bannerUrl = ''
  } else {
    ({ bannerUrl } = group)
  }

  return (
    <div className={className} styleName='s.groupDrawer'>
      <div styleName={cx('drawerHeader', { 's.currentGroup': group !== null })} style={bgImageStyle(bannerUrl)}>
        <div styleName='drawerBanner'>
          <div styleName='s.hyloLogoBar'>
            <img src='/hylo.svg' width='50px' height='36px' />
            <Icon name='Ex' styleName='s.closeDrawer' onClick={toggleDrawer} />
          </div>
          <Logo group={group} />
          {canModerate && (
            <Link styleName='s.settingsLink' to={groupUrl(group.slug, 'settings')}>
              <Icon name='Settings' styleName='s.settingsIcon' /> Group Settings
            </Link>
          )}
        </div>
        <div styleName='backgroundFade' />
      </div>
      <div>
        <ul styleName='s.groupsList'>
          <li styleName={cx('s.sectionTitle', 's.sectionTitleSeparator')}>Public</li>
          {defaultContexts && defaultContexts.map(context =>
            <ContextRow currentLocation={currentLocation} group={context} routeParams={routeParams} key={context.id} explicitPath={context.explicitPath} />
          )}
        </ul>
        <ul styleName='s.groupsList'>
          <li styleName={cx('s.sectionTitle', 's.sectionTitleSeparator')}>My Groups</li>
          <ContextRow currentLocation={currentLocation} group={allMyGroups} routeParams={routeParams} />
          {groups.map(group =>
            <ContextRow currentLocation={currentLocation} group={group} routeParams={routeParams} key={group.id} />
          )}
        </ul>
        <div styleName='s.newGroup'>
          <Button
            color='white'
            styleName='s.newGroupBtn'
            label='Start a Group'
            onClick={goToCreateGroup}
          />
        </div>
      </div>
    </div>
  )
}

export function ContextRow ({ currentLocation, group, routeParams, explicitPath }) {
  const { avatarUrl, context, name, newPostCount, slug } = group
  const imageStyle = bgImageStyle(avatarUrl || DEFAULT_AVATAR)
  const showBadge = newPostCount > 0
  const path = contextSwitchingUrl({ groupSlug: slug, context, explicitPath }, routeParams)
  return (
    <li styleName={cx('s.contextRow', { 's.currentContext': currentLocation === path })}>
      <Link to={explicitPath || contextSwitchingUrl({ context: context || 'groups', groupSlug: slug }, routeParams)} styleName='s.contextRowLink' title={name}>
        <div styleName='s.contextRowAvatar' style={imageStyle} />
        <span styleName='s.group-name'>{name}</span>
        {showBadge && <Badge expanded number={newPostCount} />}
      </Link>
    </li>
  )
}

function Logo ({ group }) {
  if (!group) return null

  const { slug, name, location, avatarUrl } = group

  return (
    <Link styleName='s.currentGroup' to={groupUrl(slug)}>
      <div styleName='s.avatar' style={bgImageStyle(avatarUrl || DEFAULT_AVATAR)} />
      <div className='drawer-inv-bd'>{name}</div>
      <div className='drawer-inv-sm'>{location}</div>
    </Link>
  )
}
