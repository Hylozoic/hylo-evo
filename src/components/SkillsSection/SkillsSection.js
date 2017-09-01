import React, { Component } from 'react'
import './SkillsSection.scss'
import Pillbox from 'components/Pillbox'
import { isEmpty, map, size } from 'lodash'
import cx from 'classnames'
import Loading from 'components/Loading'

export default class SkillsSection extends Component {
  static defaultState = {
    suggestions: [],
    expanded: false
  }

  constructor (props) {
    super(props)
    this.state = SkillsSection.defaultState
  }

  componentDidMount () {
    console.log('fetchMemberSkills', this.props.fetchMemberSkills())
    this.props.fetchMemberSkills()
  }

  componentDidUpdate (prevProps) {
    if (!isEmpty(this.props.autocomplete) && prevProps.autocomplete !== this.props.autocomplete) {
      this.props.fetchSkills()
    }

    if (prevProps.memberId !== this.props.memberId) {
      this.props.fetchMemberSkills()
    }
  }

  handleInputChange = (input) => {
    this.props.setAutocomplete(input)
  }

  handleAddition = (skill) => {
    const { addSkill } = this.props
    this.props.setAutocomplete('')
    addSkill(skill.name)
  }

  handleDelete = (id, label) => {
    const { removeSkill } = this.props

    removeSkill(id)
  }

  render () {
    const { suggestions, isMe, skills, pending } = this.props
    let { expanded } = this.state

    const showExpandButton = size(skills) > 7

    const onClick = () => this.setState({expanded: !expanded})

    if (!showExpandButton) {
      expanded = true
    }

    return (
      <div>
        <div styleName='header'>
          My Skills
        </div>
        {pending && <Loading />}
        {!pending && <div>
          <div
            styleName={cx('pill-container', {expanded, collapsed: !expanded})}>
            <Pillbox
              pills={map(skills, skill => ({...skill, label: skill.name}))}
              handleInputChange={this.handleInputChange}
              handleAddition={this.handleAddition}
              handleDelete={this.handleDelete}
              editable={isMe}
              addLabel='Add a Skill'
              placeholder={`What ${!isEmpty(skills) ? 'other ' : ''}skills do you have?`}
              suggestions={suggestions}
            />
          </div>
          {showExpandButton &&
          <span styleName='expand-button' onClick={onClick}>
            {expanded ? 'Show Less' : 'Show More Skills'}
          </span>}
        </div>}

      </div>
    )
  }
}
