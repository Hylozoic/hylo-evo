import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import Button from 'components/Button'
import TextInput from 'components/TextInput'
import './ProjectContributions.scss'

export default class ProjectContributions extends Component {
  static defaultProps = {
    stripeKey: process.env.STRIPE_PUBLISHABLE_KEY
  }

  state = {
    expanded: false,
    contributionAmount: ''
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded,
      received: false
    })
  }

  setAmount = (event) => {
    this.setState({
      contributionAmount: event.target.value.replace('$', '')
    })
  }

  render () {
    const { postId, totalContributions, processStripeToken, stripeKey } = this.props
    const { expanded, contributionAmount, received, error } = this.state

    const onToken = token => {
      this.setState({
        expanded: false,
        received: false,
        error: false
      })
      processStripeToken(postId, token.id, contributionAmount)
        .then(({ error }) => {
          this.setAmount({ target: { value: '0' } })
          if (error) {
            this.setState({ error: true })
          } else {
            this.setState({ received: true })
          }
        })
    }

    const contributionAmountNumber = Number(contributionAmount)
    const valid = !isNaN(contributionAmountNumber) &&
      contributionAmount > 0

    return <div styleName='project-contributions'>
      {received && <div styleName='success-notification'>Thanks for your contribution!</div>}
      {error && <div styleName='error-notification'>There was a problem processing your payment. Please check your card details and try again.</div>}
      {!expanded && !received && <Button
        color='green'
        onClick={this.toggleExpanded}
        label='Contribute'
        small
        narrow />}
      {expanded && <div>
        <div styleName='amount-row'>
          <span styleName='amount-label'>Amount</span>
          <TextInput
            onChange={this.setAmount}
            inputRef={input => { this.amountInput = input }}
            value={'$' + contributionAmount}
            noClearButton />
        </div>
        <StripeCheckout
          disabled={!valid}
          name='Contributing Via Stripe'
          token={onToken}
          stripeKey={stripeKey}
          amount={Number(contributionAmount)} />
        <Button
          styleName='cancel-button'
          color='gray'
          onClick={this.toggleExpanded}
          label='Cancel'
          small
          narrow />
      </div>}
      <div styleName='project-contributions-total'>Contributions so far: ${totalContributions}</div>
    </div>
  }
}
