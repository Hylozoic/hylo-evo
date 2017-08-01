import React, { Component } from 'react'
import './SkillsSection.scss'
import Pillbox from 'components/Pillbox'
import { isEmpty } from 'lodash'
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
    this.props.fetchMemberSkills(this.props.memberId)
  }

  componentDidUpdate (prevProps) {
    if (!isEmpty(this.props.autocomplete) && prevProps.autocomplete !== this.props.autocomplete) {
      this.props.fetchSkills()
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

    if (window.confirm(`Are you sure you want to remove ${label}?`)) {
      removeSkill(id, label)
    }
  }

  render () {
    const { suggestions, pending, isMe } = this.props
    let { expanded } = this.state
    let skills = this.props.skills
    if (!skills) skills = []

    const showExpandButton = skills.length > 7
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
          <div styleName={cx('pill-container', {expanded, collapsed: !expanded})}>
            <Pillbox pills={(skills || []).map(skill => ({...skill, label: skill.name, onRemove: this.handleDelete}))}
              handleInputChange={this.handleInputChange}
              handleAddition={this.handleAddition}
              handleDelete={this.handleDelete}
              editable={isMe}
              placeholder='What other skills do you have?'
              suggestions={suggestions}
            />
          </div>
          {showExpandButton && <span styleName='expand-button' onClick={onClick}>
            {expanded ? 'Show Less' : 'Show More Skills'}
          </span>}
        </div>
        }

      </div>
    )
  }
}
