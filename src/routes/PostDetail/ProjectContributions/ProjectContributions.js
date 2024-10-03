import React, { Component } from 'react'
import StripeCheckout from 'react-stripe-checkout'
import { withTranslation } from 'react-i18next'
import cx from 'classnames'
import Button from 'components/Button'
import TextInput from 'components/TextInput'
import classes from './ProjectContributions.module.scss'

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

    return <div className={classes.projectContributions}>
      {received && <div className={classes.successNotification}>{t('Thanks for your contribution!')}</div>}
      {error && <div className={classes.errorNotification}>{t('There was a problem processing your payment. Please check your card details and try again.')}</div>}
      {!expanded && !received && <Button
        color='green'
        onClick={this.toggleExpanded}
        label={t('Contribute')}
        small
        narrow />}
      {expanded && <div>
        <div className={classes.amountRow}>
          <span className={classes.amountLabel}>{t('Amount')}</span>
          <TextInput
            onChange={this.setAmount}
            inputRef={input => { this.amountInput = input }}
            value={'$' + contributionAmount}
            noClearButton />
        </div>
        <StripeCheckout
          disabled={!valid}
          name={t('Contributing Via Stripe')}
          token={onToken}
          stripeKey={stripeKey}
          amount={Number(contributionAmount)} />
        <Button
          className={classes.cancelButton}
          color='gray'
          onClick={this.toggleExpanded}
          label={t('Cancel')}
          small
          narrow />
      </div>}
      <div className={classes.projectContributionsTotal}>{t(`Contributions so far: {{totalContributions}}`, { totalContributions })}</div>
    </div>
  }
}

export default withTranslation()(ProjectContributions)
