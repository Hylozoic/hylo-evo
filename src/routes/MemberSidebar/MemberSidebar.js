import React, { Component } from 'react'
import './MemberSidebar.scss'
import MessageMember from 'components/MessageMember'
import SkillsSection from 'components/SkillsSection'

export default class MemberSidebar extends Component {
  render () {
    const { personId } = this.props.match.params

    return <div styleName='member-sidebar'>
      <MessageMember personId={personId} />
      <SkillsSection personId={personId} />
    </div>
  }
}
