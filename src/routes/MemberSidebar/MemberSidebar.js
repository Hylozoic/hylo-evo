import React, { Component } from 'react'
import './MemberSidebar.scss'
import MessageMember from 'components/MessageMember'

import SkillsSection from 'components/SkillsSection'

export default class MemberSidebar extends Component {
  render () {
    return <div styleName='member-sidebar'>
      <SkillsSection memberId={this.props.memberId} />
      <MessageMember id={this.props.memberId} />
    </div>
  }
}
