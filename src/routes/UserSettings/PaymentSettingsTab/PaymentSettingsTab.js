import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './PaymentSettingsTab.scss'
import Loading from 'components/Loading'
const { object, func } = PropTypes

const clientId = 'ca_DrLirWk9SU9LkAwouYdEu0J9aidD1sDo'
const stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write`

export default class PaymentSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func,
    loginWithService: func
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  render () {
    const {
      currentUser,
      queryParams
     } = this.props

    if (!currentUser) return <Loading />
    const { hasStripeAccount } = currentUser
    const { registered } = queryParams
    const registerSuccess = registered === 'success'
    const registerError = registered === 'error'

    return <div>
      <div styleName='title'>Connect Stripe Account</div>
      {hasStripeAccount && <div>You already have a stripe account linked to this account. If you would like to link a different account, click the button below</div>}
      <a href={stripeUrl}>Link stripe account</a>
      {registerSuccess && <div>Okay, your account is registered, you're good to go.</div>}
      {registerError && <div>There was an issue registering your stripe account. Please try again. If problems persists, contact us.</div>}      
    </div>
  }
}
