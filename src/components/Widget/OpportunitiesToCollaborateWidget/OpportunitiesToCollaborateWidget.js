import React from 'react'
import Icon from 'components/Icon'
import useRouter from 'hooks/useRouter'
import useEnsureCurrentGroup from 'hooks/useEnsureCurrentGroup'
import { getFarmOpportunities } from 'store/selectors/farmExtensionSelectors'

import './OpportunitiesToCollaborate.scss'

export default function OpportunitiesToCollaborateWidget () {
  const { group } = useEnsureCurrentGroup()
  const { push } = useRouter()
  const opportunities = getFarmOpportunities(group)
  const moderatorIds = group.moderators && group.moderators.map((mod) => mod.id)
  const hasMods = moderatorIds.length !== 0
  
  return (
    <div styleName='opportunities-to-collaborate-container'>
      {opportunities && opportunities.length > 0 && opportunities.map((opportunity) => {
        const query = new URLSearchParams('')
        if (hasMods) {
          query.append('participants', moderatorIds.join(','))
          query.append('prompt', opportunity)
        }
        return (
          <div styleName='collab-item' key={opportunity}>
            <Icon styleName='collab-icon' blue name={opportunity.charAt(0).toUpperCase() + opportunity.slice(1)} />
            <div styleName='collab-text-container'>
              <div styleName='collab-title'>{collabTitle[opportunity]}</div>
              <div styleName='collab-text'>{collabText(group)[opportunity]}</div>
            </div>
            {hasMods && <Icon name='Messages' blue={hasMods} styleName={`collab-icon${hasMods ? ' cursor-pointer' : ''}`} onClick={hasMods ? () => push(`/messages/new${hasMods ? '?' + query.toString() : ''}`) : null} />}
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
  buy: 'Buy from us',
  markets: 'New markets',
  ecosystem_service_markets: 'Ecosystem services',
  loans: 'Low-cost loans',
  support: 'Farm support',
  equipment_sharing: 'Equipment sharing'
}

const collabText = (group) => {
  return {
    research: `${group.name} is available to participate in research`,
    events: `${group.name} is open to co-hosting events`,
    volunteering: `${group.name} has some volunteering opportunities`,
    mentorship: `Contact ${group.name} to learn about their practices`,
    cooperative: `${group.name} is interested in forming a cooperative`,
    buy: `Buy from ${group.name}`,
    markets: `${group.name} is seeking new markets`,
    ecosystem_service_markets: `${group.name} is seeking ecosystem services`,
    loans: `${group.name} is interested in low-cost loans`,
    support: `${group.name} is seeking farm support`,
    equipment_sharing: `${group.name} is interested in equipment sharing`
  }
}
