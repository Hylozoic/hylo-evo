import cx from 'classnames'
import { isEmpty } from 'lodash'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { CSSTransition } from 'react-transition-group'
import { TextHelpers } from 'hylo-shared'
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
import ClickCatcher from 'components/ClickCatcher'
import HyloHTML from 'components/HyloHTML'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { SuggestedSkills } from 'routes/GroupDetail/GroupDetail'
import './GroupWelcomeModal.scss'

export default function GroupWelcomeModal (props) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const currentUser = useSelector(getMe)
  const currentGroup = useSelector(state => getGroupForCurrentRoute(state, props))
  const currentMembership = useSelector(state => getMyGroupMembership(state, props))
  const group = presentGroup(currentGroup)

  const numAgreements = group?.agreements?.length || 0
  const [acceptedAgreements, setAcceptedAgreements] = useState(Array(numAgreements).fill(false))
  const numAcceptedAgreements = acceptedAgreements.reduce((count, agreement) => count + (agreement ? 1 : 0), 0)
  const acceptedAllAgreements = numAcceptedAgreements === numAgreements

  // TODO: check if ageeements have changed and if so bring up modal again
  const showJoinForm = currentMembership?.settings?.showJoinForm // || !acceptedAllAgreements

  useEffect(() => {
    if (showJoinForm && group?.id) dispatch(fetchGroupWelcomeData(group.id))
  }, [group?.id, showJoinForm])

  useEffect(() => {
    if (numAgreements > 0) {
      setAcceptedAgreements(group.agreements.map(a => a.accepted))
    }
  }, [group?.id])

  if (!showJoinForm || !group) return null

  const handleCheckAgreement = e => {
    const accepted = e.target.checked
    const agreementIndex = e.target.value
    const newAgreements = [...acceptedAgreements]
    newAgreements[agreementIndex] = accepted
    setAcceptedAgreements(newAgreements)
  }

  const handleCheckAllAgreements = e => {
    const accepted = !acceptedAllAgreements
    const newAgreements = Array(numAgreements).fill(accepted)
    setAcceptedAgreements(newAgreements)
  }

  const closeModal = async () => {
    await dispatch(updateMembershipSettings(group.id, { showJoinForm: false }, true))
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
              <h2>{t('Welcome to {{group.name}}!', { group })}</h2>
            </div>
            <div styleName='fade' />
          </div>
          <div styleName='welcome-content'>
            {!isEmpty(group.purpose) &&
              <div>
                <h2>{t('Our Purpose')}</h2>
                <p>{group.purpose}</p>
              </div>}
            {group.agreements?.length > 0 && (
              <div styleName='agreements'>
                <h2>{t('Our Agreements')}</h2>
                <ol>
                  {group.agreements.map((agreement, i) => {
                    return (
                      <li styleName='agreement' key={i}>
                        <h3>{agreement.title}</h3>
                        <ClickCatcher>
                          <HyloHTML element='p' html={TextHelpers.markdown(agreement.description)} />
                        </ClickCatcher>
                        <input
                          type='checkbox'
                          id={'agreement' + agreement.id}
                          value={i}
                          onChange={handleCheckAgreement}
                          checked={acceptedAgreements[i]}
                        />
                        <label htmlFor={'agreement' + agreement.id} styleName={cx({ 'accepted': acceptedAgreements[i] })}>
                          {t('I agree to the above')}
                        </label>
                      </li>
                    )
                  })}
                </ol>
                {numAgreements > 3 &&
                  <div>
                    <input
                      type='checkbox'
                      id='checkAllAgreements'
                      onChange={handleCheckAllAgreements}
                      checked={acceptedAllAgreements}
                    />
                    <label htmlFor='checkAllAgreements' styleName={cx({ 'accepted': acceptedAllAgreements })}>
                      {t('I agree to all of the above')}
                    </label>
                  </div>}
              </div>
            )}

            {group.settings?.showSuggestedSkills && group.suggestedSkills?.length > 0 &&
              <SuggestedSkills addSkill={addSkill} currentUser={currentUser} group={group} removeSkill={removeSkill} />}

            <div styleName='call-to-action'>
              <Button
                data-testid='jump-in'
                disabled={!acceptedAllAgreements}
                label={t('Jump in!')}
                onClick={closeModal}
              />
            </div>
          </div>
        </div>
      </div>
    </CSSTransition>
  )
}
