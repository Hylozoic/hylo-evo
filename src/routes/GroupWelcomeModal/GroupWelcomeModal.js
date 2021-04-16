import React, { useEffect } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import Button from 'components/Button'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import { SuggestedSkills } from 'routes/GroupDetail/GroupDetail'
import { DEFAULT_AVATAR, DEFAULT_BANNER } from 'store/models/Group'
import { bgImageStyle } from 'util/index'
import './GroupWelcomeModal.scss'

function GroupWelcomeModal (props) {
  const { addSkill, fetchGroupWelcomeData, group, closeModal, currentUser, removeSkill, submit } = props

  if (!group) return null

  useEffect(() => { fetchGroupWelcomeData() }, [])

  return <CSSTransitionGroup
    transitionName='welcome-modal'
    transitionAppear
    transitionAppearTimeout={400}
    transitionEnterTimeout={400}
    transitionLeaveTimeout={300}>
    <div styleName='welcome-modal-wrapper' key='welcome-modal'>
      <div styleName='welcome-modal' className='welcome-modal'>
        <span styleName='close-button' onClick={closeModal}><Icon name='Ex' /></span>
        <div style={bgImageStyle(group.bannerUrl || DEFAULT_BANNER)} styleName='banner'>
          <div styleName='banner-content'>
            <RoundImage url={group.avatarUrl || DEFAULT_AVATAR} size='50px' square />
            <h3>Welcome to {group.name}!</h3>
          </div>
          <div styleName='fade' />
        </div>
        <div styleName='welcome-content'>
          {group.settings.showSuggestedSkills && group.suggestedSkills && group.suggestedSkills.length > 0 &&
            <SuggestedSkills addSkill={addSkill} currentUser={currentUser} group={group} removeSkill={removeSkill} />}
          <div styleName='call-to-action'>
            <Button label='Jump in!' onClick={submit} />
          </div>
        </div>
      </div>
    </div>
  </CSSTransitionGroup>
}

export default GroupWelcomeModal
