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
    this.state = {
      registeredStripeCode: false,
      registeredSuccessfully: false
    }
  }

  componentDidMount () {
    if (this.props.stripeQueryParams.code) {
      this.props.registerStripeAccount(this.props.stripeQueryParams.code)
      .then(() => {
        this.setState({
          registeredStripeCode: true,
          registeredSuccessfully: true
        })
      })
    }
  }

  render () {
    const {
      currentUser,
      stripeQueryParams
     } = this.props

    const {
      registeredSuccessfully
    } = this.state

    console.log('stripeQueryParams', stripeQueryParams)

    if (!currentUser) return <Loading />
    const { hasStripeAccount } = currentUser

    return <div>
      <div styleName='title'>Connect Stripe Account</div>
      {hasStripeAccount && <div>You already have a stripe account linked to this account. If you would like to link a different account, click the button below</div>}
      <a href={stripeUrl}>Link stripe account</a>
      {registeredSuccessfully && <div>Okay, your account is registered, you're good to go.</div>}
    </div>
  }
}
