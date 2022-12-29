import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { withTranslation } from 'react-i18next'
import Button from 'components/Button'
import TextInput from 'components/TextInput'
import './ProjectContributions.scss'

class ProjectContributions extends Component {
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
    const { postId, totalContributions, processStripeToken, stripeKey, t } = this.props
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
      {received && <div styleName='success-notification'>{this.props.t('Thanks for your contribution!')}</div>}
      {error && <div styleName='error-notification'>{this.props.t('There was a problem processing your payment. Please check your card details and try again.')}</div>}
      {!expanded && !received && <Button
        color='green'
        onClick={this.toggleExpanded}
        label={this.props.t('Contribute')}
        small
        narrow />}
      {expanded && <div>
        <div styleName='amount-row'>
          <span styleName='amount-label'>{this.props.t('Amount')}</span>
          <TextInput
            onChange={this.setAmount}
            inputRef={input => { this.amountInput = input }}
            value={'$' + contributionAmount}
            noClearButton />
        </div>
        <StripeCheckout
          disabled={!valid}
          name={this.props.t('Contributing Via Stripe')}
          token={onToken}
          stripeKey={stripeKey}
          amount={Number(contributionAmount)} />
        <Button
          styleName='cancel-button'
          color='gray'
          onClick={this.toggleExpanded}
          label={this.props.t('Cancel')}
          small
          narrow />
      </div>}
      <div styleName='project-contributions-total'>{this.props.t(`Contributions so far: {{totalContributions}}`, { totalContributions })}</div>
    </div>
  }
}

export default withTranslation()(ProjectContributions)
