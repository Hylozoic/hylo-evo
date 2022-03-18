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
        return (
          <div styleName='collab-item' key={opportunity}>
            <Icon styleName='collab-icon' blue name={opportunity.charAt(0).toUpperCase() + opportunity.slice(1)} />
            <div styleName='collab-text-container'>
              <div styleName='collab-title'>{collabTitle[opportunity]}</div>
              <div styleName='collab-text'>{collabText(group)[opportunity]}</div>
            </div>
            <Icon name='Messages' blue styleName='collab-icon' />
          </div>
        )
      })}
    </div>
  )
}

const collabTitle = {
  research: 'Research projects',
  events: 'Event collaboration',
  volunteering: 'Volunteer opportunties',
  mentorship: 'Mentorship & advice',
  cooperative: 'Cooperatives',
  buy: 'Buy from us'
}

const collabText = (group) => {
  return {
    research: `${group.name} is available to participate in research`,
    events: `${group.name} is open to co-hosting events`,
    volunteering: `${group.name} has some volunteering opportunities`,
    mentorship: `Contact ${group.name} to learn about their practices`,
    cooperative: `${group.name} is interested in forming a cooperative`,
    buy: `Buy from ${group.name}`
  }
}
