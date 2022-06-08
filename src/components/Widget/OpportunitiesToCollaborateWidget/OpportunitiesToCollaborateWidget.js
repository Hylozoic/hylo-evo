import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'components/Icon'
import useRouter from 'hooks/useRouter'
import useEnsureCurrentGroup from 'hooks/useEnsureCurrentGroup'
import { getFarmOpportunities } from 'store/selectors/farmExtensionSelectors'
import { messageGroupModerators } from '../Widget.store'
import getMe from 'store/selectors/getMe'

import './OpportunitiesToCollaborate.scss'

export default function OpportunitiesToCollaborateWidget () {
  const { group } = useEnsureCurrentGroup()
  const { push } = useRouter()
  const opportunities = getFarmOpportunities(group)
  const currentUser = useSelector(state => getMe(state))
  const dispatch = useDispatch()
  return (
    <div styleName='opportunities-to-collaborate-container'>
      {opportunities && opportunities.length > 0 && opportunities.map((opportunity) => {
        const prompt = `Hi there ${group.name}, I'd like to talk about ${promptLookup[opportunity]}.`
        return (
          <div styleName='collab-item' key={opportunity}>
            <Icon styleName='collab-icon' blue name={determineIcon(opportunity)} />
            <div styleName='collab-text-container'>
              <div styleName='collab-title'>{collabTitle[opportunity]}</div>
              <div styleName='collab-text'>{collabText(group)[opportunity]}</div>
            </div>
            {currentUser && <Icon
              name='Messages'
              blue
              styleName='collab-icon cursor-pointer'
              onClick={() => dispatch(messageGroupModerators(group.id)).then(a => a.payload?.data?.messageGroupModerators ? push(`/messages/${a.payload.data.messageGroupModerators}?prompt=${encodeURIComponent(prompt)}`) : null)}
            />}
          </div>
        )
      })}
    </div>
  )
}

const collabTitle = {
  research: 'Research projects',
  events: 'Event collaboration',
  volunteering: 'Volunteer opportunities',
  mentorship: 'Mentorship & advice',
  cooperative: 'Cooperatives',
  buy: 'Buy from us',
  markets: 'New markets',
  ecosystem_service_markets: 'Ecosystem services',
  loans: 'Low-cost loans',
  support: 'Farm support',
  equipment_sharing: 'Equipment sharing',
  increase_sales: 'Increasing sales',
  communication: 'Communication & marketing',
  new_products_methods: 'New methods & practices',
  carbon: 'Carbon markets',
  environmental_impact: 'Environmental impact',
  benchmarking: 'Benchmarking',
  insetting: 'Insetting',
  reduce_risk: 'Hazard risk mitigation',
  farm_valuation: 'Farm valuation',
  certifications: 'Certifications',
  food_nutrition: 'Nutrient density',
  biodiversity: 'Biodiversity',
  product_quality: 'Product quality',
  animal_welfare: 'Animal welfare'
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
    equipment_sharing: `${group.name} is interested in equipment sharing`,
    increase_sales: `${group.name} is interested in increasing their sales`,
    communication: `${group.name} seeks better communication / marketing to their buyers`,
    new_products_methods: `${group.name} wants to learn about new methods or practices`,
    carbon: `${group.name} is interested in carbon markets`,
    environmental_impact: `${group.name} is curious about better understanding their farm through data (soil, environmental impacts, etc.)`,
    benchmarking: `${group.name} wants to comparing my farm to others`,
    insetting: `${group.name} wants to easily provide data to supply chain partners`,
    reduce_risk: `${group.name} wants to reduce hazard risk (fire, flood, drought, etc.)`,
    farm_valuation: `${group.name} wants to increase their farm valuation`,
    certifications: `${group.name} is curious about further certification (organic, ISO, regenerative, etc.)`,
    food_nutrition: `${group.name} is curious about understanding the nutrient density of their product`,
    biodiversity: `${group.name} wants help focusing on biodiversity (protecting species, improving ecology, markets)`,
    product_quality: `${group.name} wants to improve product quality`,
    animal_welfare: `${group.name} wants to ensure animal welfare`
  }
}

// XXX: flag for internationalization/translation
const promptLookup = {
  research: 'research projects',
  events: 'event collaboration',
  volunteering: 'volunteer opportunities',
  mentorship: 'mentorship & advice',
  cooperative: 'cooperatives',
  buy: 'purchasing from you',
  markets: 'new markets',
  ecosystem_service_markets: 'ecosystem services',
  loans: 'low-cost loans',
  support: 'farm support',
  equipment_sharing: 'equipment sharing',
  increase_sales: 'increasing sales',
  communication: 'helping with your communication & marketing',
  new_products_methods: 'introducing new methods & practices',
  carbon: 'carbon markets',
  environmental_impact: 'environmental impact',
  benchmarking: 'benchmarking your farm',
  insetting: 'insetting',
  reduce_risk: 'hazard risk mitigation',
  farm_valuation: 'farm valuation',
  certifications: 'certifications',
  food_nutrition: 'nutrient density',
  biodiversity: 'biodiversity',
  product_quality: 'product quality',
  animal_welfare: 'animal welfare'
}

const determineIcon = (opportunity) => {
  switch (opportunity) {
    case 'research': return 'Research'
    case 'events': return 'Events'
    case 'volunteering': return 'Volunteering'
    case 'mentorship': return 'Mentorship'
    case 'cooperative': return 'Cooperative'
    case 'buy': return 'Buy'
    case 'markets': return 'Markets'
    case 'ecosystem_service_markets': return 'Ecosystem_service_markets'
    case 'loans': return 'Loans'
    case 'support': return 'Support'
    case 'equipment_sharing': return 'Equipment_sharing'
    case 'increase_sales': return 'Markets'
    case 'communication': return 'Markets'
    case 'new_products_methods': return 'Mentorship'
    case 'carbon': return 'Ecosystem_service_markets'
    case 'environmental_impact': return 'Ecosystem_service_markets'
    case 'benchmarking': return 'Ecosystem_service_markets'
    case 'insetting': return 'Loans'
    case 'reduce_risk': return 'Ecosystem_service_markets'
    case 'farm_valuation': return 'Loans'
    case 'certifications': return 'Ecosystem_service_markets'
    case 'food_nutrition': return 'Ecosystem_service_markets'
    case 'biodiversity': return 'Ecosystem_service_markets'
    case 'product_quality': return 'Ecosystem_service_markets'
    case 'animal_welfare': return 'Ecosystem_service_markets'
  }
}
