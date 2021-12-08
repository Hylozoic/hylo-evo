import React from 'react'
import { JoinSection } from 'routes/GroupDetail/GroupDetail'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import { get, keyBy, map, trim } from 'lodash'
import { inIframe } from 'util/index'

import './Join.scss'

export default function JoinWidget ({ currentUser, addSkill, group, joinRequests, onClose, removeSkill, routeParams, location }) {
  // current params
  // items: widgetItems, group, routeParams, settings 
  const groupsWithPendingRequests = keyBy(joinRequests, 'group.id')

  return  <div styleName='join-container'>
    {!currentUser
      ? <div styleName='signupButton'><Link to={'/login?returnToUrl=' + location.pathname} target={inIframe() ? '_blank' : ''} styleName='requestButton'>Signup or Login to connect with <span styleName='requestGroup'>{group.name}</span></Link></div>
      : <div>
        <div styleName='groupProfiles'>
          <div styleName='profileContainer'>
            <div styleName='groupSubtitle'>Recent Posts</div>
            <div styleName='profile'>
              <Icon name='BadgeCheck' />
              <span styleName='profileText'>Only members of this group can see posts</span>
            </div>
          </div>
          <div styleName='profileContainer'>
            <div styleName='groupSubtitle'>{group.memberCount} {group.memberCount > 1 ? `Members` : `Member`}</div>
            {get(group, 'settings.publicMemberDirectory')
              ? <div>{group.members.map(member => {
                return <div key={member.id} styleName='avatarContainer'><Avatar avatarUrl={member.avatarUrl} styleName='avatar' /><span>{member.name}</span></div>
              })}</div>
              : <div styleName='profile'>
                <Icon name='Unlock' />
                <span styleName='profileText'>Join to see</span>
              </div>
            }
          </div>
        </div>
        <JoinSection
          addSkill={addSkill}
          currentUser={currentUser}
          fullPage={!onClose}
          group={group}
          groupsWithPendingRequests={groupsWithPendingRequests}
          joinGroup={this.joinGroup}
          requestToJoinGroup={this.requestToJoinGroup}
          removeSkill={removeSkill}
          routeParams={routeParams}
        />
      </div>}
  </div>
}