import { FARM_ONBOARDING } from 'util/constants'

export default function getFarmData (group) {
  if (group && !group.groupExtensions) return null
  return group.groupExtensions.items.find((extension) => extension.type === FARM_ONBOARDING).data || null
}
