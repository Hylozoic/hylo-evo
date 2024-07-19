import { createSelector } from 'reselect'
import { FARM_ONBOARDING } from 'util/constants'

const hideExtensionDataSelector = (group) => group?.settings?.hideExtensionData
const groupExtensionsSelector = (group) => group?.groupExtensions

export const getFarmData = createSelector(
  hideExtensionDataSelector,
  groupExtensionsSelector,
  (hideExtensionData, groupExtensions) => {
    if (hideExtensionData) return {}
    if (!groupExtensions) return {}
    return groupExtensions.items.find((extension) => extension.type === FARM_ONBOARDING).data || {}
  }
)

export default getFarmData
