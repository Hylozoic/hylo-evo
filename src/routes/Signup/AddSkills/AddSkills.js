import React, { Component } from 'react'
import { get } from 'lodash/fp'
import { map } from 'lodash'
import cx from 'classnames'
import SignupModalFooter from '../SignupModalFooter'
import LeftSidebar from '../LeftSidebar'
import Pillbox from 'components/Pillbox'

import '../Signup.scss'

export default class AddSkills extends Component {
  constructor () {
    super()
    this.state = {
      mySkills: []
    }
  }
  clickHandler = (skill) => {
    const { mySkills } = this.state
    mySkills.push(skill)
    this.setState({
      mySkills
    })
    this.props.addSkill(skill.name)
  }

  fetchSkillsFromList (currentUser) {
    return skills
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
    const { mySkills } = this.state
    const expanded = true

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
            {this.fetchSkillsFromList().map((skill, index) =>
              <Pill key={index} skill={skill} handler={() => this.clickHandler(skill)} handlerArg={'name'} />
            )}
          </div>}
        </div>
        <div>
          <div
            styleName={cx('pill-container', {expanded, collapsed: !expanded})}>
            <Pillbox
              pills={map(mySkills, skill => ({...skill, label: skill.name}))}
              editable={false}
              addLabel='Add a Skill'
              placeholder={null}
              suggestions={null}
            />
          </div>
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
