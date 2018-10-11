import React, { Component } from 'react'
import './MemberSidebar.scss'
import MessageMember from 'components/MessageMember'
import SkillsSection from 'components/SkillsSection'

export default class MemberSidebar extends Component {
  render () {
    const { memberId } = this.props

    return <div styleName='member-sidebar'>
      <MessageMember id={memberId} />
      <SkillsSection memberId={memberId} />
    </div>
  }
}
