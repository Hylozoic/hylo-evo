import { useCurrentUser } from 'hooks/useCurrentUser'
import React from 'react'

import './plansTab.scss'

export default function PlansTab ({ group = {} }) {
  const currentUser = useCurrentUser()

  /*
    What data is needed?

    What needs to be shown?
    - list of 
  */
  return (
    <div>
      <div styleName='title'>
        Plans
      </div>
      yay
    </div>
  )
}
