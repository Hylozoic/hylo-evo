import React, { Component } from 'react'
import { isEmpty } from 'lodash'
import SignupModalFooter from '../SignupModalFooter'

import '../Signup.scss'

export default class AddSkills extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editing: false,
      skillText: ''
    }
    this.skillInput = React.createRef()
  }

  clickHandler = (skill) => {
    this.props.addSkill(skill.name)
  }

  getRemainingSkills = () => {
    const addedSkills = this.props.skills.map(skill => skill.name)
    return defaultSkills.filter(function (skill) {
      return (addedSkills.indexOf(skill.name) === -1)
    })
  }

  submit = () => {
    this.props.goToNextStep()
  }

  previous = () => {
    this.props.goToPreviousStep()
  }

  componentDidMount = () => {
    this.props.fetchMySkills()
  }

  editNewSkill = () => {
    this.setState({
      editing: true,
      skillText: ''
    })
    this.skillInput.current && this.skillInput.current.focus()
  }

  createNewSkill = () => {
    this.props.addSkill(this.state.skillText)
    this.setState({
      editing: false,
      skillText: ''
    })
  }

  handleInputChange = event => {
    this.setState({
      skillText: event.target.value
    })
  }

  render () {
    const { editing, skillText } = this.state

    return <div styleName='flex-wrapper'>
      <div styleName='panel'>
        <span styleName='white-text step-count'>STEP 3/4</span>
        <br />
        <div styleName='center'>
          <input
            ref={this.skillInput}
            value={skillText}
            styleName='signup-input center-text signup-padding large-input-text gray-bottom-border'
            autoFocus
            onKeyPress={event => {
              if (event.key === 'Enter') {
                if (editing) {
                  this.createNewSkill()
                } else {
                  this.submit()
                }
              }
            }}
            onClick={() => this.editNewSkill()}
            onChange={this.handleInputChange}
            placeholder={editing ? '' : 'Add skills & interests'}
            readOnly={!editing}
          />
        </div>
        <div>
          {<div styleName='skills'>
            {this.getRemainingSkills().map((skill, index) =>
              <Pill key={index} skill={skill} clickHandler={() => this.props.addSkill(skill.name)} />
            )}
            <Pill id='other-pill' skill={{ name: '+ Other' }} clickHandler={() => this.editNewSkill()} />
          </div>}
        </div>
        <div>
          {!isEmpty(this.props.skills) && <div styleName='your-skills'>
            <div styleName='your-skills-label'><span>Your Skills &amp; Interests:</span></div>
            <div styleName='your-skills-list'>
              {this.props.skills.map((skill, index) =>
                <Pill key={index} skill={skill} clickHandler={() => this.props.removeSkill(skill.id)} />
              )}
            </div>
          </div>}
        </div>
        <div>
          <SignupModalFooter
            previous={this.previous}
            submit={editing ? this.createNewSkill : this.submit}
            continueText={editing ? 'Save Skill or Interest' : 'Boom, Done'} />
        </div>
      </div>
    </div>
  }
}

export function Pill ({ skill, clickHandler }) {
  return <span styleName='skill' onClick={clickHandler}>
    {skill.name}
  </span>
}

const defaultSkills = [
  { name: 'Writing' },
  { name: 'Design' },
  { name: 'Project Management' },
  { name: 'Photography' },
  { name: 'Facilitation' },
  { name: 'Media' },
  { name: 'Group Organizing' },
  { name: 'Technology' },
  { name: 'Social Media' },
  { name: 'Event Planning' },
  { name: 'Education' },
  { name: 'Communications' }
]
