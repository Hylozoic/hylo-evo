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
      registeredStripeCode: false
    }
  }

  componentDidMount () {
    if (this.props.stripeQueryParams) {
            
    }
  }

  render () {
    const {
      currentUser,
      stripeQueryParams
     } = this.props

    console.log('stripeQueryParams', stripeQueryParams)

    if (!currentUser) return <Loading />
    const { hasStripeAccount } = currentUser

    return <div>
      <div styleName='title'>Connect Stripe Account</div>
      <a href={stripeUrl}>Link stripe account</a>
    </div>
  }
}
