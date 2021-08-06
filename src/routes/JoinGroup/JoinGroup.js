import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { groupUrl } from 'util/navigation'
import Loading from 'components/Loading'

export const SIGNUP_PATH = '/signup'
export const EXPIRED_INVITE_PATH = '/invite-expired'

export default class JoinGroup extends Component {
  componentWillMount () {
    const {
      isLoggedIn, currentUser, fetchForCurrentUser, useInvitation, checkInvitation
    } = this.props
    if (!isLoggedIn) {
      checkInvitation()
    } else {
      fetchForCurrentUser()
      if (currentUser) useInvitation()
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.currentUser && nextProps.currentUser) {
      this.props.useInvitation()
    }
  }

  render () {
    const { isLoggedIn, groupSlug, hasCheckedValidInvite, isValidInvite, redirectToView } = this.props
    if (!isLoggedIn && hasCheckedValidInvite) {
      if (isValidInvite) {
        return <Redirect to={SIGNUP_PATH} />
      } else {
        return <Redirect to={EXPIRED_INVITE_PATH} />
      }
    }
    if (isLoggedIn && groupSlug) return <Redirect to={groupUrl(groupSlug, redirectToView || 'explore')} />
    return <Loading />
  }
}
