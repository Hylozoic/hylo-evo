import React from 'react'
import Loading from 'components/Loading'

export default class LoginCheck extends React.Component {
  componentDidMount () {
    this.props.checkLogin()
  }

  render () {
    if (!this.props.hasCheckedLogin) {
      return <Loading type='fullscreen' />
    }

    return this.props.children
  }
}
