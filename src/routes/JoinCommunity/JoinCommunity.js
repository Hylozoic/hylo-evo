import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { communityUrl } from 'util/index'

export default class JoinCommunity extends Component {
  componentWillReceiveProps (nextProps) {
    if (this.props.currentUser !== nextProps.currentUser) {
      this.props.useInvitation(nextProps.currentUser.id)
    }
  }

  render () {
    const { communitySlug, error } = this.props
    if (communitySlug) return <Redirect to={communityUrl(communitySlug)} />
    return <h1>{error}</h1>
  }
}
