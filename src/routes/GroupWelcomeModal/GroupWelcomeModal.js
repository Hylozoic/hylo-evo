import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { bgImageStyle } from 'util/index'
import getMe from 'store/selectors/getMe'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMyGroupMembership from 'store/selectors/getMyGroupMembership'
import presentGroup from 'store/presenters/presentGroup'
import { DEFAULT_AVATAR, DEFAULT_BANNER } from 'store/models/Group'
import { addSkill as addSkillAction, removeSkill as removeSkillAction } from 'components/SkillsSection/SkillsSection.store'
import { fetchGroupWelcomeData } from './GroupWelcomeModal.store'
import { updateMembershipSettings } from 'routes/UserSettings/UserSettings.store'
import Button from 'components/Button'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { SuggestedSkills } from 'routes/GroupDetail/GroupDetail'
import './GroupWelcomeModal.scss'

export default function GroupWelcomeModal (props) {
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const currentGroup = useSelector(state => getGroupForCurrentRoute(state, props))
  const currentMembership = useSelector(state => getMyGroupMembership(state, props))
  const group = presentGroup(currentGroup)
  const showJoinForm = currentMembership?.settings?.showJoinForm
  const { t } = useTranslation()

  useEffect(() => {
    if (showJoinForm && group?.id) dispatch(fetchGroupWelcomeData(group.id))
  }, [group?.id, showJoinForm])

  if (!showJoinForm || !group) return null

  const closeModal = async () => {
    await dispatch(updateMembershipSettings(group.id, { showJoinForm: false }))
    return null
  }

  const addSkill = name => dispatch(addSkillAction(name))

  const removeSkill = skillId => dispatch(removeSkillAction(skillId))

  return (
    <CSSTransition
      classNames='welcome-modal'
      appear
      in
      timeout={{ appear: 400, enter: 400, exit: 300 }}
    >
      <div styleName='welcome-modal-wrapper' key='welcome-modal'>
        <div styleName='welcome-modal' className='welcome-modal'>
          <span styleName='close-button' onClick={closeModal}><Icon name='Ex' /></span>
          <div style={bgImageStyle(group.bannerUrl || DEFAULT_BANNER)} styleName='banner'>
            <div styleName='banner-content'>
              <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} size='50px' square />
              <h3>{t('Welcome to {{group.name}}!', { group })}</h3>
            </div>
            <div styleName='fade' />
          </div>
          <div styleName='welcome-content'>
            {group.settings.showSuggestedSkills && group.suggestedSkills && group.suggestedSkills.length > 0 &&
              <SuggestedSkills addSkill={addSkill} currentUser={currentUser} group={group} removeSkill={removeSkill} />}
            <div styleName='call-to-action'>
              <Button label={t('Jump in!')} data-testid='jump-in' onClick={closeModal} />
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}
