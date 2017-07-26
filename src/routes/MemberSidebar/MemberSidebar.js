import React, { Component } from 'react'
import './MemberSidebar.scss'
import MessageMember from 'components/MessageMember'
import Pillbox from 'components/Pillbox'

export default class CommunitySidebar extends Component {
  render () {
    return <div styleName='member-sidebar'>
      <SkillsSection />
      <MessageMember id={this.props.memberId} />
    </div>
  }
}

export function SkillsSection () {
  return <Pillbox pills={[{id: 1, label: 'test', onClick: () => {}}, {id: 2, label: 'unclickable'}]} />
}
