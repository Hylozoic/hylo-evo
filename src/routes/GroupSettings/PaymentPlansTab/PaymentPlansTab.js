import { capitalize } from 'lodash'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Button from 'components/Button'
import Icon from 'components/Icon'
import Pill from 'components/Pill'
import RoundImage from 'components/RoundImage'
//import { useCurrentUser } from 'hooks/useCurrentUser'
import { useEnsureGroupPlans } from 'hooks/useEnsureGroupPlans'
import useRouter from 'hooks/useRouter'
import {
  DEFAULT_BANNER,
  DEFAULT_AVATAR
} from 'store/models/Group'
import { bgImageStyle } from 'util/index'

import { connectGroupToStripe } from '../GroupSettings.store'


import './PaymentPlansTab.scss'

const clientId = process.env.STRIPE_CLIENT_ID
const stripeUrl = `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${clientId}&scope=read_write`

export default function PaymentPlansTab (props) {
  // const currentUser = useCurrentUser()
  const dispatch = useDispatch()
  const { push } = useRouter()
  const { group } = props
  const groupPlans = useEnsureGroupPlans(group.id)
  const { hasStripeAccount } = props.group
  const queryParams = useParams()
  const { registered } = queryParams
  const registerSuccess = registered === 'success'
  const registerError = registered === 'error'

  /*
    What data is needed?
    - group from props
    - currentUser
    - (groupTab) all plans associated with a group
    - (userTab) all plans for groups the user moderates
    - (userTab) all plans a user is subscribed to

    What needs to be shown?
    group tab
    - A 'Create plan' button to navigate to the plan creation
    - list of plans associated with group
      - Highlight any plans the currentUser is linked to
    user tab
    - list of plans from groups user moderates
    - list of plans user is subscribed to
  */

  const goToStripe = () => {
    dispatch(connectGroupToStripe(group.id)).then((res) => { console.log("yoyo", res); window.location.href = res.payload.data.connectGroupToStripe.redirectURL })
  }

  return (
    <div>
      <div styleName='title'>
        Payment Plans
      </div>
      <div styleName='title'>Connect Stripe Account</div>
      {!hasStripeAccount && <div styleName='prompt'>Click the button below to create a free Stripe account (or connect an existing account). Once you've done that you will be able to accept contributions to Projects.</div>}
      {hasStripeAccount && <div styleName='prompt'>You already have a stripe account linked to this account. If you would like to link a different account, click the button below.</div>}
      {registerSuccess && <div styleName='success-notification'>Your account is registered, you're ready to accept contributions to projects.</div>}
      {registerError && <div styleName='error-notification'>There was an issue registering your stripe account. Please try again. If the problem persists, contact us.</div>}
      <Button
        label='Link Stripe Account'
        onClick={goToStripe}
      />

      <div>
        <div styleName='sub-title-container'>
          <div styleName='sub-title'>
            Payment plans for this group
          </div>
          <Link to={`/plans/create/groups/${group.id}`} styleName='add-plan button'>
            <Icon name='Plus' />
          </Link>
        </div>
        <div styleName='list-container'>
          {groupPlans.map((plan, index) => {
            return (<PlanCard key={index} plan={plan} group={group} />)
          })}
        </div>
      </div>
    </div>
  )
}

const PlanCard = ({ plan, group, currentUser }) => {
  const { atAGlance, pitch } = plan
  const linkTo = `/plans/${plan.id}`
  return (
    <Link to={linkTo} styleName='plan-link'>
      {
        !plan.active &&
          <div styleName='inactive'><div styleName='inactive-text'>Inactive</div></div>
      }
      <div styleName='card'>
        <PlanHeader
          plan={plan}
          group={group}
        />
        {pitch &&
          <div styleName='plan-description'>
            {pitch}
          </div>}
        {atAGlance.length > 0
          ? <div styleName='plan-tags'>
            {atAGlance.map((value, index) => (
              <Pill
                styleName='tag-pill'
                darkText
                label={capitalize(value.toLowerCase())}
                id={value.id}
                key={index}
              />
            ))}
          </div>
          : ''
        }
      </div>
    </Link>
  )
}

function PlanHeader ({ constrained = false, group = {}, plan }) {
  return (
    <div styleName='header' >
      <div style={bgImageStyle(plan.bannerUrl || group?.bannerUrl || DEFAULT_BANNER)} styleName='plan-card-background'><div /></div>
      <div styleName='header-main-row'>
        <RoundImage url={plan.avatarUrl || group?.avatarUrl || DEFAULT_AVATAR} styleName='plan-image' size='50px' />
        <div styleName='plan-label'>
          <div styleName='plan-title'>{plan.name}
          </div>
          <div styleName='plan-geo-descriptor'>
            { group.name && `Payment plan for ${group.name}`}
          </div>
        </div>
        <div styleName='plan-details'>
          <div>
            <div styleName='detail-label'>Term</div>
            <div styleName='detail-value'>{plan.term}</div>
          </div>
          <div>
            <div styleName='detail-label'>Charge</div>
            <div styleName='detail-value'>${plan.charge}</div>
          </div>
          <div>
            <div styleName='detail-label'>#</div>
            <div styleName='detail-value'>{plan.planCount}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
