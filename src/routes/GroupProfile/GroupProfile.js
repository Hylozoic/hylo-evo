import React, { useState } from 'react'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import Widget from 'components/Widget'
import { useSelector } from 'react-redux'
import { groupDetailUrl } from 'util/navigation'
import {
  accessibilityDescription,
  accessibilityIcon,
  accessibilityString,
  DEFAULT_BANNER,
  DEFAULT_AVATAR,
  GROUP_ACCESSIBILITY,
  visibilityDescription,
  visibilityIcon,
  visibilityString
} from 'store/models/Group'

import './GroupProfile.scss'
import presentGroup from 'store/presenters/presentGroup'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getCanModerate from 'store/selectors/getCanModerate'
import { fetchPosts, getPosts } from 'components/FeedList/FeedList.store'
import getRouteParam from 'store/selectors/getRouteParam'
import presentPost from 'store/presenters/presentPost'
import { getChildGroups } from 'store/selectors/getGroupRelationships'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getMyJoinRequests from 'store/selectors/getMyJoinRequests'
import { JOIN_REQUEST_STATUS } from 'store/models/JoinRequest'

export default function GroupProfile (props) {
  // TODO: move these selectors into a big group hook
  const groupSlug = useSelector(state => getRouteParam('groupSlug', state, props))
  const fetchPostsParam = { slug: groupSlug, context: 'groups', sortBy: 'created' }
  const group = useSelector((state) => presentGroup(getGroupForCurrentRoute(state, props)))
  const isModerator = useSelector((state) => getCanModerate(state, { group }))
  const posts = useSelector((state) => getPosts(state, fetchPostsParam).map(p => presentPost(p, group.id)))
  const routeParams = props.match.params
  const widgets = ((group && group.widgets) || []).filter(w => w.name !== 'map' && w.context === 'group_profile')
  const memberships = useSelector(state => getMyMemberships(state, props))
  const joinRequests = useSelector(state => getMyJoinRequests(state, props).filter(jr => jr.status === JOIN_REQUEST_STATUS.Pending))
  const childGroups = useSelector(state => getChildGroups(state, { groupSlug }).map(g => {
    g.memberStatus = memberships.find(m => m.group.id === g.id) ? 'member' : joinRequests.find(jr => jr.group.id === g.id) ? 'requested' : 'not'
    return g
  }))
  // this.props.fetchPosts()  ==>   do I need an useEnsurePosts?

  // TODO: flip accessibility/privacy stuff into a widget
  // TODO: For 'normal' groups, either data migration for default group profile widgets, or default it in the code

  return <div styleName={'fullPage group'}>
    <div styleName='groupProfileHeader' style={{ backgroundImage: `url(${group.bannerUrl || DEFAULT_BANNER})` }}>
      <div styleName='groupTitleContainer'>
        <img src={group.avatarUrl || DEFAULT_AVATAR} styleName='groupAvatar' />
        <div>
          <div styleName='groupTitle'>{group.name}</div>
          <div styleName='groupContextInfo'>
            <div>
              <span styleName='group-privacy'>
                <Icon name={visibilityIcon(group.visibility)} styleName='privacy-icon' />
                <div styleName='privacy-tooltip'>
                  <div>{visibilityString(group.visibility)} - {visibilityDescription(group.visibility)}</div>
                </div>
              </span>
              <span styleName='group-privacy'>
                <Icon name={accessibilityIcon(group.accessibility)} styleName='privacy-icon' />
                <div styleName='privacy-tooltip'>
                  <div>{accessibilityString(group.accessibility)} - {accessibilityDescription(group.accessibility)}</div>
                </div>
              </span>
            </div>
            <span styleName='group-location'>{group.location}</span>
          </div>
        </div>
      </div>
      <div styleName='headerBackground' />
    </div>
    <div styleName='groupProfileBody'>
      {widgets && widgets.map(widget =>
        <Widget
          {...widget}
          childGroups={childGroups}
          key={widget.id}
          group={group}
          isModerator={isModerator}
          posts={posts}
          routeParams={routeParams}
        />
      )}
    </div>
  </div>
}
