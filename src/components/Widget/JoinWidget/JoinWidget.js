import React from 'react'
import { useTranslation } from 'react-i18next'
import { JoinSection } from 'routes/GroupDetail/GroupDetail'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import { get } from 'lodash'
import { inIframe } from 'util/index'
import { addSkill, removeSkill } from 'components/SkillsSection/SkillsSection.store'
import { useDispatch } from 'react-redux'

import './Join.scss'
import useRouter from 'hooks/useRouter'
import { useCurrentUser } from 'hooks/useCurrentUser'
import { createJoinRequest, joinGroup } from 'routes/GroupDetail/GroupDetail.store'
import { useKeyJoinRequestsByGroupId } from 'hooks/useGetJoinRequests'

export default function JoinWidget ({ group, fullPage = true, routeParams }) {
  const dispatch = useDispatch()
  const { location } = useRouter()
  const currentUser = useCurrentUser()
  const groupsWithPendingRequests = useKeyJoinRequestsByGroupId()
  const handleAddSkill = (skillId) => dispatch(addSkill(skillId))
  const handleRemoveSkill = (skillId) => dispatch(removeSkill(skillId))
  const handleJoinGroup = (groupId) => dispatch(joinGroup(groupId))
  const handleRequestToJoinGroup = (groupId, questionAnswers) => dispatch(createJoinRequest(groupId, questionAnswers))
  const { t } = useTranslation()

  return <div styleName='join-container'>
    {!currentUser
      ? <div styleName='signupButton'><Link to={'/login?returnToUrl=' + location.pathname} target={inIframe() ? '_blank' : ''} styleName='requestButton'>{t('JoinWidget.signUpOrLogin')} <span styleName='requestGroup'>{group.name}</span></Link></div>
      : <div>
        <div styleName='groupProfiles'>
          <div styleName='profileContainer'>
            <div styleName='groupSubtitle'>{t('JoinWidget.recentPosts')}</div>
            <div styleName='profile'>
              <Icon name='BadgeCheck' />
              <span styleName='profileText'>{t('JoinWidget.onlyMembersViewPost')}</span>
            </div>
          </div>
          <div styleName='profileContainer'>
            <div styleName='groupSubtitle'>{group.memberCount} {group.memberCount > 1 ? t('JoinWidget.members') : t('JoinWidget.member')}</div>
            {get(group, 'settings.publicMemberDirectory')
              ? <div>{group.members.map(member => {
                return <div key={member.id} styleName='avatarContainer'><Avatar avatarUrl={member.avatarUrl} styleName='avatar' /><span>{member.name}</span></div>
              })}</div>
              : <div styleName='profile'>
                <Icon name='Unlock' />
                <span styleName='profileText'>{t('JoinWidget.joinToSee')}</span>
              </div>
            }
          </div>
        </div>
        <JoinSection
          addSkill={handleAddSkill}
          currentUser={currentUser}
          fullPage={fullPage}
          group={group}
          groupsWithPendingRequests={groupsWithPendingRequests}
          joinGroup={handleJoinGroup}
          requestToJoinGroup={handleRequestToJoinGroup}
          removeSkill={handleRemoveSkill}
          routeParams={routeParams}
        />
      </div>}
  </div>
}
