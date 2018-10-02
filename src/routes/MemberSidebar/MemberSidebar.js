import React, { Component } from 'react'
import './MemberSidebar.scss'
import MessageMember from 'components/MessageMember'
import SkillsSection from 'components/SkillsSection'

export default class MemberSidebar extends Component {
  blockUser = () => {
    const message = `Are you sure you want to block this member?
    You will no longer see this member\'s activity
    and they won't see yours.
    
    You can unblock this member at any time.
    Go to Settings > Blocked Users.`

    if (window.confirm(message)) this.props.blockUser()
  }

  render () {
    const { memberId, blockUser } = this.props

    return <div styleName='member-sidebar'>
      <MessageMember id={memberId} />
      <SkillsSection memberId={memberId} />
      <button onClick={this.blockUser} type='reset'>Block this Member</button>
    </div>
  }
}
