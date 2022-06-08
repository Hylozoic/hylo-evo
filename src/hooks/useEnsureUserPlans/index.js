import { useEnsureGroupPlans } from 'hooks/useEnsureGroupPlans'

export function useEnsureUserPlans () {
  const moderatorPlans = useEnsureGroupPlans()

  const userPlans = [
    {
      name: 'Only Farms',
      charge: 25,
      term: 'quarterly',
      active: true,
      description: 'Farms Farms Farms!',
      pitch: 'Get farm updates every week',
      atAGlance: ['Perennials', 'Food forests', 'Barns'],
      avatarUrl: null,
      bannerUrl: null,
      badgeUrl: null,
      id: 25,
      planCount: 25,
      groups: [20866]
    }
  ]

  return { moderatorPlans, userPlans }
}
