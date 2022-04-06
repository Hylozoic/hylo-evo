import { FARM_ONBOARDING } from 'util/constants'

export default function getFarmData (group) {
  if (group && !group.groupExtensions) return {}
  return group.groupExtensions.items.find((extension) => extension.type === FARM_ONBOARDING).data || {}
}
