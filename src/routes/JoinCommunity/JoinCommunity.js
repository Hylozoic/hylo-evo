import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { communityUrl } from 'util/index'

export default class JoinCommunity extends Component {
  componentWillMount () {
    this.props.checkInvitation()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.isLoggedIn && this.props.currentUser !== nextProps.currentUser) {
      this.props.useInvitation(nextProps.currentUser.id)
    }
  }

  render () {
    const { isLoggedIn, communitySlug, hasCheckedValidToken, validToken } = this.props
    if (!isLoggedIn && hasCheckedValidToken) {
      if (validToken) {
        return <Redirect to={'/login'} />
      } else {
        return <Redirect to={'/invite-expired'} />
      }
    }
    if (isLoggedIn && communitySlug) return <Redirect to={communityUrl(communitySlug)} />
    return null
  }
}
