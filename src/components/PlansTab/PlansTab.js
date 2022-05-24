import React from 'react'
import { Link } from 'react-router-dom'
import { bgImageStyle } from 'util/index'
import { capitalize } from 'lodash'
import { useCurrentUser } from 'hooks/useCurrentUser'
import { useEnsureGroupPlans } from 'hooks/useEnsureGroupPlans'
import { useEnsureUserPlans } from 'hooks/useEnsureUserPlans'
import Pill from 'components/Pill'
import Icon from 'components/Icon'
import RoundImage from 'components/RoundImage'
import {
  DEFAULT_BANNER,
  DEFAULT_AVATAR
} from 'store/models/Group'

import './plansTab.scss'

export default function PlansTab ({ group = {} }) {
  const currentUser = useCurrentUser()
  const isGroupView = !!group.id
  const { moderatorPlans, userPlans } = useEnsureUserPlans(currentUser.id)
  const groupPlans = useEnsureGroupPlans(group.id)

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
  return (
    <div>
      <div styleName='title'>
        Payment Plans
      </div>
      {
        isGroupView &&
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
                return (<PlanCard key={index} plan={plan} group={group} isGroupView={isGroupView} />)
              })}
            </div>
          </div>
      }
      {
        !isGroupView &&
          <>
            {
              moderatorPlans.length > 0 &&
                <div>
                  <div styleName='sub-title'>
                    Payment plans you manage
                  </div>
                  <div styleName='list-container'>
                    {moderatorPlans.map((plan, index) => {
                      return (<PlanCard key={index} plan={plan} isGroupView={isGroupView} />)
                    })}
                  </div>
                </div>
            }
            <div>
              <div styleName='sub-title'>
                Payment plans you subscribe to
              </div>
              {userPlans.length > 0
                ? <div styleName='list-container'>
                  {userPlans.map((plan, index) => {
                    return (<PlanCard key={index} plan={plan} isGroupView={isGroupView} />)
                  })}
                  </div>
                : <div>
                  You aren't on any payment plans
                </div>}
            </div>
          </>
      }
    </div>
  )
}

const PlanCard = ({ plan, group, currentUser, isGroupView }) => {
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
          isGroupView={isGroupView}
          // highlightProps={highlightProps}
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

function PlanHeader ({ constrained = false, group = {}, plan, isGroupView }) {
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
          {isGroupView &&
            <div>
              <div styleName='detail-label'>#</div>
              <div styleName='detail-value'>{plan.planCount}</div>
            </div>}
        </div>
      </div>
    </div>
  )
}
