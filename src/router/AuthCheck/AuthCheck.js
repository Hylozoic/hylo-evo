import { get } from 'lodash/fp'
import React from 'react'
import Loading from 'components/Loading'

export default class AuthCheck extends React.Component {
  componentDidMount () {
    this.props.checkLogin()
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.isLoggedIn && nextProps.isLoggedIn) {
      // avoid fetching topics for All Communities if we're just going to redirect
      // to a single community
      const skipTopics = this.props.location.pathname !== '/all'
      this.props.fetchForCurrentUser(skipTopics)
    }
  }

  componentDidUpdate (prevProps) {
    if (get('community.id', this.props) !== get('community.id', prevProps)) {
      this.props.currentUser && this.props.fetchForCommunity()
    }
  }

  render () {
    if (!this.props.hasCheckedLogin || (this.props.isLoggedIn && !this.props.currentUser)) {
      return <Loading type='fullscreen' />
    }

    return this.props.children
  }
}
