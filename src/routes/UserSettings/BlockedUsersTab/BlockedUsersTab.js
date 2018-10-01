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
      <div styleName='name'>{blockedUser.name}</div>
      <div onClick={unBlockUserFun} styleName='unblock-button'>Unblock</div>
    </div>
  </div>
}
