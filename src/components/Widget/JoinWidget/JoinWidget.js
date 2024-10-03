import { get } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Icon from 'components/Icon'
import { JoinSection } from 'routes/GroupDetail/GroupDetail'

import { inIframe } from 'util/index'
import { addSkill, removeSkill } from 'components/SkillsSection/SkillsSection.store'
import { useDispatch } from 'react-redux'

import classes from './Join.module.scss'
import { useCurrentUser } from 'hooks/useCurrentUser'
import { createJoinRequest, joinGroup } from 'routes/GroupDetail/GroupDetail.store'
import { useKeyJoinRequestsByGroupId } from 'hooks/useGetJoinRequests'

export default function JoinWidget ({ group, fullPage = true, routeParams }) {
  const dispatch = useDispatch()
  const { location } = useLocation()
  const currentUser = useCurrentUser()
  const groupsWithPendingRequests = useKeyJoinRequestsByGroupId()
  const handleAddSkill = (skillId) => dispatch(addSkill(skillId))
  const handleRemoveSkill = (skillId) => dispatch(removeSkill(skillId))
  const handleJoinGroup = (groupId) => dispatch(joinGroup(groupId))
  const handleRequestToJoinGroup = (groupId, questionAnswers) => dispatch(createJoinRequest(groupId, questionAnswers))
  const { t } = useTranslation()

  return (
    <div className={classes.joinContainer}>
      {!currentUser
        ? <div className={classes.signupButton}><Link to={'/login?returnToUrl=' + location.pathname} target={inIframe() ? '_blank' : ''} className={classes.requestButton}>{t('Signup or Login to connect with')} <span className={classes.requestGroup}>{group.name}</span></Link></div>
        : <div>
          <div className={classes.groupProfiles}>
            <div className={classes.profileContainer}>
              <div className={classes.groupSubtitle}>{t('Recent Posts')}</div>
              <div className={classes.profile}>
                <Icon name='BadgeCheck' />
                <span className={classes.profileText}>{t('Only members of this group can see posts')}</span>
              </div>
            </div>
            <div className={classes.profileContainer}>
              <div className={classes.groupSubtitle}>{group.memberCount} {group.memberCount > 1 ? t(`Members`) : t(`Member`)}</div>
              {get(group, 'settings.publicMemberDirectory')
                ? <div>{group.members.map(member => {
                  return <div key={member.id} className={classes.avatarContainer}><Avatar avatarUrl={member.avatarUrl} className={classes.avatar} /><span>{member.name}</span></div>
                })}</div>
                : <div className={classes.profile}>
                  <Icon name='Unlock' />
                  <span className={classes.profileText}>{t('Join to see')}</span>
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
  )
}
