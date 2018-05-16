import React, { Component } from 'react'
import IntercomComponent from 'react-intercom'
import { intercom } from 'config'

export default class IntercomInit extends Component {
  render () {
    const { currentUser } = this.props

    if (!currentUser) return null

    const appID = intercom.appId
    const user = {
      user_id: currentUser.id,
      email: currentUser.email,
      name: currentUser.name,
      user_hash: currentUser.intercomHash
    }

    return <IntercomComponent appID={appID} {...user} />
  }
}
