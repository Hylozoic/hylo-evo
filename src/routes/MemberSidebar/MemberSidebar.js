import React, { Component } from 'react'
import './MemberSidebar.scss'
import MessageMember from 'components/MessageMember'

export default class CommunitySidebar extends Component {

  render () {
    return <div styleName='member-sidebar'>
      <SkillsSection />
      <MessageMember id={this.props.memberId} />
    </div>
  }
}

export class SkillsSection extends Component {
  render () {
    return <div>Skills Here</div>
  }
}
