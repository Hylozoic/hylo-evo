import React, { Component } from 'react'
import { get } from 'lodash/fp'
import { isEmpty } from 'lodash'
import SignupModalFooter from '../SignupModalFooter'
import LeftSidebar from '../LeftSidebar'

import '../Signup.scss'

export default class AddSkills extends Component {
  clickHandler = (skill) => {
    this.props.addSkill(skill.name)
  }

  getRemainingSkills = () => {
    const addedSkills = []
    for (let index in this.props.skills) {
      const skill = this.props.skills[index]
      addedSkills.push(skill.name)
    }
    return skills.filter(function (skill) {
      return (addedSkills.indexOf(skill.name) === -1)
    })
  }

  submit = () => {
    this.props.goToNextStep()
  }

  previous = () => {
    this.props.goToPreviousStep()
  }

  componentWillMount = () => {
    const { currentUser } = this.props
    if (get('settings.signupInProgress', currentUser) === 'false') this.props.goBack()
  }

  componentDidMount = () => {
    this.props.fetchMySkills()
  }
  render () {
    return <div styleName='flex-wrapper'>
      <LeftSidebar
        header='Share your unique super powers!'
        body="What skills are you known for? The more skills you add, the more relevant the content. It's like magic."
      />
      <div styleName='right-panel'>
        <span styleName='white-text step-count'>STEP 3/4</span>
        <br />
        <div styleName='center'>
          <input
            styleName='signup-input center-text signup-padding large-input-text gray-bottom-border'
            autoFocus
            onChange={this.handleInputChange}
            placeholder={'How can you help?'}
            readOnly
          />
        </div>
        <div>
          {skills && <div styleName='skills'>
            {this.getRemainingSkills().map((skill, index) =>
              <Pill key={index} skill={skill} handler={() => this.clickHandler(skill)} handlerArg={'name'} />
            )}
          </div>}
        </div>
        <div>
          { !isEmpty(this.props.skills) && <div styleName='your-skills'>
            <div styleName='your-skills-label'><span>Your Skills:</span></div>
            <div styleName='your-skills-list'>
              {this.props.skills.map((skill, index) =>
                <Pill key={index} skill={skill} handler={() => this.clickHandler(skill)} handlerArg={'name'} />
              )}
            </div>
          </div>}
        </div>
        <div>
          <SignupModalFooter previous={this.previous} submit={this.submit} continueText={'Boom, Done'} />
        </div>
      </div>
    </div>
  }
}

export function Pill ({skill, handler, handlerArg}) {
  return <span styleName='skill' onClick={() => handler(skill[handlerArg])}>
    {skill.name}
  </span>
}

const skills = [
  {name: 'Writing'},
  {name: 'Design'},
  {name: 'Project Management'},
  {name: 'Photography'},
  {name: 'Facilitation'},
  {name: 'Media'},
  {name: 'Community Organizing'},
  {name: 'Technology'},
  {name: 'Social Media'},
  {name: 'Event Planning'},
  {name: 'Education'},
  {name: 'Communications'}
]
