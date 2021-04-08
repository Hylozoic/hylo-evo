import React, { useEffect } from 'react'
import { CSSTransitionGroup } from 'react-transition-group'
import Button from 'components/Button'
import Icon from 'components/Icon'
import { SuggestedSkills } from 'routes/GroupDetail/GroupDetail'
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
        <h1>Welcome to my {group.name}!</h1>
        {group.settings.showSuggestedSkills && group.suggestedSkills && group.suggestedSkills.length > 0 &&
          <SuggestedSkills addSkill={addSkill} currentUser={currentUser} group={group} removeSkill={removeSkill} />}
        <Button label='Jump in!' onClick={submit} />
      </div>
    </div>
  </CSSTransitionGroup>
}

export default GroupWelcomeModal
