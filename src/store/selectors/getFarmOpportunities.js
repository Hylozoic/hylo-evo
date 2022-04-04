import getFarmData from 'store/selectors/getFarmData'

export default function getFarmOpportunities (group) {
  // select farm-onboarding extension
  const farmData = getFarmData(group)
  return farmData.collaboration_interest || []
}
