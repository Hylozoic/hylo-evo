import React, { Component } from 'react'
import './SkillsSection.scss'
import Pillbox from 'components/Pillbox'
import { isEmpty, map } from 'lodash'
import cx from 'classnames'
import Loading from 'components/Loading'

export default class SkillsSection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      skillSuggestions: []
    }
  }

  componentDidMount () {
    this.props.fetchMemberSkills()
  }

  componentDidUpdate (prevProps) {
    if (!isEmpty(this.props.search) && prevProps.search !== this.props.search) {
      this.props.fetchSkillSuggestions()
    }
    if (prevProps.personId !== this.props.personId) {
      this.props.fetchMemberSkills()
    }
  }

  handleInputChange = (input) => this.props.setSearch(input)

  handleAddition = (skill) => {
    this.props.setSearch('')
    this.props.addSkill(skill.name)
  }

  handleDelete = skillId => this.props.removeSkill(skillId)

  handleClick = (skillId, skillLabel) => {
    this.props.searchForSkill(skillLabel)
  }

  render () {
    if (this.props.loading) return <Loading />

    const {
      skillSuggestions,
      isMe,
      skills
    } = this.props

    return (
      <div>
        <div styleName='header'>
          My Skills &amp; Interests
        </div>
        <div
          styleName={cx('pill-container', 'expanded')}>
          <Pillbox
            pills={map(skills, skill => ({ ...skill, label: skill.name }))}
            handleInputChange={this.handleInputChange}
            handleClick={this.handleClick}
            handleAddition={this.handleAddition}
            handleDelete={this.handleDelete}
            editable={isMe}
            addLabel='Add a Skill or Interest'
            placeholder={`What ${!isEmpty(skills) ? 'other ' : ''}skills and interests do you have?`}
            suggestions={skillSuggestions}
          />
        </div>
      </div>
    )
  }
}
