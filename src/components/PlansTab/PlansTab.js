import { useCurrentUser } from 'hooks/useCurrentUser'
import { useEnsureGroupPlans } from 'hooks/useEnsureGroupPlans'
import { useEnsureUserPlans } from 'hooks/useEnsureUserPlans'
import React from 'react'

import './plansTab.scss'

export default function PlansTab ({ group = {} }) {
  const currentUser = useCurrentUser()
  const isGroupView = !!group.id
  const { moderatorPlans, userPlans } = useEnsureUserPlans()
  const groupPlans = useEnsureGroupPlans(group.id)

  /*
    What data is needed?
    - group from props
    - currentUser
    - (groupTab) all plans assocaited with a group
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
        Plans
      </div>
      {
        isGroupView &&
          <div styleName='sub-title'>
            Plans that include this group
          </div>
      }
      {
        !isGroupView &&
          <>
            {
              moderatorPlans.length > 0 &&
                <div>
                  <div styleName='sub-title'>
                    Plans you manage
                  </div>
                  <div styleName='list-container'>
                    yaya
                  </div>
                </div>
            }
            <div>
              <div styleName='sub-title'>
                Plans you subscribe to
              </div>
              {userPlans.length > 0
                ?
                  <div styleName='list-container'>
                    yaya
                  </div>
                :
                  <div>
                    You haven't subscribed to any plans
                  </div>
              }
            </div>
          </>
      }
      
    </div>
  )
}
