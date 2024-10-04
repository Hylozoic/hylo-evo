import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { useTranslation, withTranslation } from 'react-i18next'
import classes from './BlockedUsersTab.module.scss'
import Loading from 'components/Loading'

const { array, func } = PropTypes

class BlockedUsersTab extends Component {
  static propTypes = {
    memberships: array,
    updateMembershipSettings: func
  }

  render () {
    const { blockedUsers, unBlockUser, loading } = this.props
    if (loading || !blockedUsers) return <Loading />

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
  const { t } = useTranslation()

  return <div className={classes.unblockUserControl}>
    <div className={classes.row}>
      <div className={classes.name}>{blockedUser.name}</div>
      <div onClick={unBlockUserFun} className={classes.unblockButton}>{t('Unblock')}</div>
    </div>
  </div>
}
export default withTranslation()(BlockedUsersTab)
