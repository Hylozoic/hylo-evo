import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { communityUrl } from 'util/index'
import Loading from 'components/Loading'

export const LOGIN_PATH = '/login'
export const EXPIRED_INVITE_PATH = '/invite-expired'

export default class JoinCommunity extends Component {
  componentWillMount () {
    const {
      isLoggedIn, currentUser, useInvitation, checkInvitation
    } = this.props
    if (!isLoggedIn) {
      checkInvitation()
    } else {
      if (currentUser) useInvitation(currentUser.id)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.currentUser && nextProps.currentUser) {
      this.props.useInvitation(nextProps.currentUser.id)
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
