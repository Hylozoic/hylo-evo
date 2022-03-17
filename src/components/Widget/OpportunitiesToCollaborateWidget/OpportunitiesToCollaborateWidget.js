import React from 'react'
import useEnsureCurrentGroup from 'hooks/useEnsureCurrentGroup'
import getFarmOpportunities from 'store/selectors/getFarmOpportunities'
import Icon from 'components/Icon'

import './OpportunitiesToCollaborate.scss'

export default function OpportunitiesToCollaborateWidget ({ group }) {

  const opportunities = getFarmOpportunities(group)
  return (
    <div styleName='opportunities-to-collaborate-container'>
      {opportunities && opportunities.length > 0 && opportunities.map((opportunity) => {
        return <div key={opportunity}><Icon name={opportunity.charAt(0).toUpperCase() + opportunity.slice(1)} />{opportunity}</div>
      })}
    </div>
  )
}
