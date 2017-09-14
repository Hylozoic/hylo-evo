import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { communityUrl } from 'util/index'
import Loading from 'components/Loading'

export const LOGIN_PATH = '/login'
export const EXPIRED_INVITE_PATH = '/invite-expired'

export default class JoinCommunity extends Component {
  componentWillMount () {
    const {
      isLoggedIn, fetchForCurrentUser, checkInvitation, useInvitation
    } = this.props
    !isLoggedIn && checkInvitation()
    if (isLoggedIn) {
      fetchForCurrentUser(null, true)
      .then(currentUser => useInvitation(currentUser.id))
    }
  }

  render () {
    const { isLoggedIn, communitySlug, hasCheckedValidToken, validToken } = this.props
    if (!isLoggedIn && hasCheckedValidToken) {
      if (validToken) {
        return <Redirect to={LOGIN_PATH} />
      } else {
        return <Redirect to={EXPIRED_INVITE_PATH} />
      }
    }
    if (isLoggedIn && communitySlug) return <Redirect to={communityUrl(communitySlug)} />
    return <Loading />
  }
}
