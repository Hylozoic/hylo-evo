import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useHistory } from 'react-router-dom'
import { get } from 'lodash/fp'
import { useDispatch, useSelector } from 'react-redux'
import { bgImageStyle } from 'util/index'
import { baseUrl, createGroupUrl, groupUrl } from 'util/navigation'
import {
  ALL_GROUPS_ID, ALL_GROUPS_AVATAR_PATH, DEFAULT_AVATAR,
  PUBLIC_CONTEXT_ID, PUBLIC_CONTEXT_AVATAR_PATH, GROUP_EXPLORER_ID, GROUP_EXPLORER_AVATAR_PATH, PUBLIC_MAP_ID, PUBLIC_MAP_AVATAR_PATH, MY_HOME_AVATAR_PATH, MY_HOME_ID
} from 'store/models/Group'
import { toggleDrawer as toggleDrawerAction } from 'routes/AuthLayoutRouter/AuthLayoutRouter.store'
import getMyGroups from 'store/selectors/getMyGroups'
import getCanModerate from 'store/selectors/getCanModerate'
import Badge from 'components/Badge'
import Button from 'components/Button'
import Icon from 'components/Icon'
import cx from 'classnames'
import s from './Drawer.scss' // eslint-disable-line no-unused-vars

const myPath = '/my'

export default function Drawer (props) {
  const history = useHistory()
  const { t } = useTranslation()
  const currentLocation = useLocation()
  const dispatch = useDispatch()
  const groups = useSelector(getMyGroups)
  const canModerate = useSelector(state => props.group && getCanModerate(state, props))
  const { group, className } = props
  const defaultContexts = [
    {
      id: PUBLIC_CONTEXT_ID,
      name: t('Public Stream'),
      groups: [],
      context: 'public',
      explicitPath: '/public/',
      avatarUrl: PUBLIC_CONTEXT_AVATAR_PATH
    },
    {
      id: GROUP_EXPLORER_ID,
      name: t('Public Groups'),
      groups: [],
      context: 'public',
      explicitPath: '/public/groups/',
      avatarUrl: GROUP_EXPLORER_AVATAR_PATH
    },
    {
      id: PUBLIC_MAP_ID,
      name: t('Public Map'),
      groups: [],
      context: 'public',
      explicitPath: '/public/map/',
      avatarUrl: PUBLIC_MAP_AVATAR_PATH
    }
  ]
  const allMyGroups = {
    id: ALL_GROUPS_ID,
    name: t('All My Groups'),
    groups: [],
    context: 'all',
    avatarUrl: ALL_GROUPS_AVATAR_PATH
  }

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
              <Icon name='Settings' styleName='s.settingsIcon' /> {t('Group Settings')}
            </Link>
          )}
        </div>
        <div styleName='backgroundFade' />
      </div>
      <div>
        <ul styleName='s.groupsList'>
          <ContextRow currentLocation={currentLocation} group={myHome} explicitPath={myHome.explicitPath} />
        </ul>
        <ul styleName='s.groupsList'>
          <li styleName={cx('s.sectionTitle', 's.sectionTitleSeparator')}>{t('Public')}</li>
          {defaultContexts && defaultContexts.map(context =>
            <ContextRow currentLocation={currentLocation} group={context} key={context.id} explicitPath={context.explicitPath} />
          )}
        </ul>
        <ul styleName='s.groupsList'>
          <li styleName={cx('s.sectionTitle', 's.sectionTitleSeparator')}>{t('My Groups')}</li>
          <ContextRow currentLocation={currentLocation} group={allMyGroups} />
          {groups.map(group =>
            <ContextRow currentLocation={currentLocation} group={group} key={group.id} />
          )}
        </ul>
        <div styleName='s.newGroup'>
          <Button
            color='white'
            styleName='s.newGroupBtn'
            label={t('Start a Group')}
            onClick={goToCreateGroup}
          />
        </div>
      </div>
    </div>
  )
}

export function ContextRow ({
  currentLocation,
  group,
  explicitPath
}) {
  const { avatarUrl, context, name, newPostCount, slug } = group
  const imageStyle = bgImageStyle(avatarUrl || DEFAULT_AVATAR)
  const showBadge = newPostCount > 0
  const path = explicitPath || baseUrl({ context, groupSlug: slug })
  return (
    <li styleName={cx('s.contextRow', { 's.currentContext': currentLocation?.pathname === path || (path.includes(myPath) && currentLocation?.pathname.includes(myPath)) })}>
      <Link to={path} styleName='s.contextRowLink' title={name}>
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
