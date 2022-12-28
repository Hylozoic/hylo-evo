import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { newMessageUrl } from 'util/navigation'
import useRouter from 'hooks/useRouter'
import useEnsureCurrentGroup from 'hooks/useEnsureCurrentGroup'
import { getFarmOpportunities } from 'store/selectors/farmExtensionSelectors'
import getMe from 'store/selectors/getMe'
import Icon from 'components/Icon'

import './OpportunitiesToCollaborate.scss'

export default function OpportunitiesToCollaborateWidget () {
  const { group } = useEnsureCurrentGroup()
  const opportunities = getFarmOpportunities(group)

  return (
    <div styleName='opportunities-to-collaborate-container'>
      {opportunities && opportunities.length > 0 && opportunities.map((opportunity, index) => (
        <OpportunityToCollaborate group={group} opportunity={opportunity} key={index} />
      ))}
    </div>
  )
}

export function OpportunityToCollaborate ({ group, opportunity }) {
  const { t } = useTranslation()
  const promptLookup = { // TODO: Can we figure out a way to reduce duplication here?
    research: t('research projects'),
    events: t('event collaboration'),
    volunteering: t('volunteer opportunities'),
    mentorship: t('mentorship & advice'),
    cooperative: t('cooperatives'),
    buy: t('purchasing from you'),
    markets: t('new markets'),
    ecosystem_service_markets: t('ecosystem services'),
    loans: t('low-cost loans'),
    support: t('farm support'),
    equipment_sharing: t('equipment sharing'),
    increase_sales: t('increasing sales'),
    communication: t('helping with your communication & marketing'),
    new_products_methods: t('introducing new methods & practices'),
    carbon: t('carbon markets'),
    environmental_impact: t('environmental impact'),
    benchmarking: t('benchmarking your farm'),
    insetting: t('insetting'),
    reduce_risk: t('hazard risk mitigation'),
    farm_valuation: t('farm valuation'),
    certifications: t('certifications'),
    food_nutrition: t('nutrient density'),
    biodiversity: t('biodiversity'),
    product_quality: t('product quality'),
    animal_welfare: t('animal welfare')
  }
  const collabTitle = {
    research: t('Research projects'),
    events: t('Event collaboration'),
    volunteering: t('Volunteer opportunities'),
    mentorship: t('Mentorship & advice'),
    cooperative: t('Cooperatives'),
    buy: t('Buy from us'),
    markets: t('New markets'),
    ecosystem_service_markets: t('Ecosystem services'),
    loans: t('Low-cost loans'),
    support: t('Farm support'),
    equipment_sharing: t('Equipment sharing'),
    increase_sales: t('Increasing sales'),
    communication: t('Communication & marketing'),
    new_products_methods: t('New methods & practices'),
    carbon: t('Carbon markets'),
    environmental_impact: t('Environmental impact'),
    benchmarking: t('Benchmarking'),
    insetting: t('Insetting'),
    reduce_risk: t('Hazard risk mitigation'),
    farm_valuation: t('Farm valuation'),
    certifications: t('Certifications'),
    food_nutrition: t('Nutrient density'),
    biodiversity: t('Biodiversity'),
    product_quality: t('Product quality'),
    animal_welfare: t('Animal welfare')
  }
  const currentUser = useSelector(state => getMe(state))
  const { push } = useRouter()
  const prompt = t(`Hi there {group.name}, I'd like to talk about {promptLookup[opportunity]}.`, { group, opportunity, promptLookup })
  const goToGroupModeratorsMessage = useCallback(() => {
    push(
      `${newMessageUrl()}?participants=${group.moderators.map(m => m.id).join(',')}&prompt=${encodeURIComponent(prompt)}`
    )
  }, [group?.id, prompt])

  return (
    <div styleName='collab-item' key={opportunity}>
      <Icon styleName='collab-icon' blue name={determineIcon(opportunity)} />
      <div styleName='collab-text-container'>
        <div styleName='collab-title'>{collabTitle[opportunity]}</div>
        <div styleName='collab-text'>{collabText(group)[opportunity]}</div>
      </div>
      {currentUser && (
        <Icon
          name='Messages'
          blue
          styleName='collab-icon cursor-pointer'
          onClick={goToGroupModeratorsMessage}
        />
      )}
    </div>
  )
}

const collabText = (group) => {
  const { t } = useTranslation()
  return {
    research: t(`{{group.name}} is available to participate in research`, { group }),
    events: t(`{{group.name}} is open to co-hosting events`, { group }),
    volunteering: t(`{{group.name}} has some volunteering opportunities`, { group }),
    mentorship: t(`Contact {{group.name}} to learn about their practices`, { group }),
    cooperative: t(`{{group.name}} is interested in forming a cooperative`, { group }),
    buy: t(`Buy from {{group.name}}`, { group }),
    markets: t(`{{group.name}} is seeking new markets`, { group }),
    ecosystem_service_markets: t(`{{group.name}} is seeking ecosystem services`, { group }),
    loans: t(`{{group.name}} is interested in low-cost loans`, { group }),
    support: t(`{{group.name}} is seeking farm support`, { group }),
    equipment_sharing: t(`{{group.name}} is interested in equipment sharing`, { group }),
    increase_sales: t(`{{group.name}} is interested in increasing their sales`, { group }),
    communication: t(`{{group.name}} seeks better communication / marketing to their buyers`, { group }),
    new_products_methods: t(`{{group.name}} wants to learn about new methods or practices`, { group }),
    carbon: t(`{{group.name}} is interested in carbon markets`, { group }),
    environmental_impact: t(`{{group.name}} is curious about better understanding their farm through data (soil, environmental impacts, etc.)`, { group }),
    benchmarking: t(`{{group.name}} wants to comparing my farm to others`, { group }),
    insetting: t(`{{group.name}} wants to easily provide data to supply chain partners`, { group }),
    reduce_risk: t(`{{group.name}} wants to reduce hazard risk (fire, flood, drought, etc.)`, { group }),
    farm_valuation: t(`{{group.name}} wants to increase their farm valuation`, { group }),
    certifications: t(`{{group.name}} is curious about further certification (organic, ISO, regenerative, etc.)`, { group }),
    food_nutrition: t(`{{group.name}} is curious about understanding the nutrient density of their product`, { group }),
    biodiversity: t(`{{group.name}} wants help focusing on biodiversity (protecting species, improving ecology, markets)`, { group }),
    product_quality: t(`{{group.name}} wants to improve product quality`, { group }),
    animal_welfare: t(`{{group.name}} wants to ensure animal welfare`, { group })
  }
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
