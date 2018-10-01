import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './BlockedUsersTab.scss'
import Loading from 'components/Loading'

const { array, func } = PropTypes

export default class BlockedUsersTab extends Component {
  static propTypes = {
    memberships: array,
    updateMembershipSettings: func
  }

  render () {
    const { blockedUsers, unBlockUser } = this.props
    if (!blockedUsers) return <Loading />

    return <div>
      {blockedUsers.map(blockedUser =>
        <UnBlockUserControl
          blockedUser={blockedUser}
          unBlockUser={unBlockUser}
          key={blockedUser.id} />)}
    </div>
  }
}

export function UnBlockUserControl ({ blockedUser, unBlockUser }) {
  const unBlockUserFun = () => unBlockUser(blockedUser.id)

  return <div styleName='unblock-user-control'>
    <div styleName='row'>
      <span styleName='name'>{blockedUser.name}</span>
      <span onClick={unBlockUserFun} styleName='unblock-button'>Unblock</span>
    </div>
  </div>
}
