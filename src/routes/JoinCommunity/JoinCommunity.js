import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { communityUrl } from 'util/navigation'
import Loading from 'components/Loading'

export const SIGNUP_PATH = '/signup'
export const EXPIRED_INVITE_PATH = '/invite-expired'

export default class JoinCommunity extends Component {
  componentWillMount () {
    const {
      isLoggedIn, currentUser, fetchForCurrentUser, useInvitation, checkInvitation
    } = this.props
    if (!isLoggedIn) {
      checkInvitation()
    } else {
      fetchForCurrentUser()
      if (currentUser) useInvitation(currentUser.id)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.currentUser && nextProps.currentUser) {
      this.props.useInvitation(nextProps.currentUser.id)
    }
  }

  render () {
    const { isLoggedIn, communitySlug, hasCheckedValidInvite, isValidInvite } = this.props
    if (!isLoggedIn && hasCheckedValidInvite) {
      if (isValidInvite) {
        return <Redirect to={SIGNUP_PATH} />
      } else {
        return <Redirect to={EXPIRED_INVITE_PATH} />
      }
    }
    if (isLoggedIn && communitySlug) return <Redirect to={communityUrl(communitySlug)} />
    return <Loading />
  }
}
