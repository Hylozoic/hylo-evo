import React, { Component } from 'react'
import SignupModalFooter from '../SignupModalFooter'
import LeftSidebar from '../LeftSidebar'

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
    if (currentUser && currentUser.settings && currentUser.settings.signupInProgress === 'false') this.props.goBack()
  }

  componentDidMount = () => {
    this.props.fetchMySkills()
  }
  render () {
    const { mySkills } = this.state
    return <div styleName='wrapper'>
      <LeftSidebar
        header='Add your location'
        body='Add your location to see more relevant content, and find people and projects around you.'
      />
      <div styleName='detail'>
        <span styleName='white-text step-count'>STEP 3/4</span>
        <br />
        <div styleName='center center-skills'>
          <input
            styleName='signup-input center-text'
            autoFocus
            onChange={this.handleInputChange}
            placeholder={'How can you help?'}
            readOnly
          />
        </div>
        <div styleName='skills-cloud'>
          {skills && <div styleName='skills'>
            {this.fetchSkillsFromList().map((skill, index) =>
              <Pill key={index} skill={skill} handler={() => this.clickHandler(skill)} handlerArg={'name'} />
            )}
          </div>}
        </div>
        <div styleName='my-skills-cloud'>
          {mySkills && mySkills.map((skill, index) =>
            <Pill key={index} skill={skill} handler={this.props.removeSkill} handlerArg={'id'} />
          )}
        </div>
        <div>
          <SignupModalFooter previous={this.previous} submit={this.submit} />
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
  {name: 'Community Organizing'},
  {name: 'Technology'},
  {name: 'Social Media'},
  {name: 'Event Planning'},
  {name: 'Education'},
  {name: 'Media'},
  {name: 'Communications'}
]
