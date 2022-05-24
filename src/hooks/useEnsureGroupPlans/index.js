export function useEnsureGroupPlans () {
  const groupPlans = [
    {
      name: 'Hylo Supporter',
      charge: 10,
      term: 'monthly',
      active: true,
      description: 'A lot of many many words, very exciting to talk about, yayayayay whooo',
      pitch: 'Support the running and stewardship of Hylo',
      atAGlance: ['Support Hylo', 'Open Source', 'Public Utility'],
      avatarUrl: null,
      bannerUrl: null,
      badgeUrl: null,
      id: 24,
      planCount: 35,
      groupIds: [20866]
    },
    {
      name: 'Quarter supporter',
      charge: 25,
      term: 'quarterly',
      active: false,
      description: 'Collect funds for our bioregional organizing and collaborating',
      pitch: 'Fund our bioregional efforts!',
      atAGlance: ['Bioregional', 'self-organizing', 'community'],
      avatarUrl: null,
      bannerUrl: null,
      badgeUrl: null,
      id: 25,
      planCount: 25,
      groupIds: [20866]
    },
    {
      name: 'Year-long support',
      charge: 90,
      term: 'annual',
      active: true,
      description: 'A very long and detailed description of what is happening, ayayayayayayasdyfaysdfyasdfyaysdfa iauhsfdiauh sfi asdfoash fd  aosidfjaoisjfdoiajsdfoi   aosidjfaoisjdfoiajsdofijaosidfj  faosdfjaiosdjfasf oasijdfoasjdff aosidfjaos',
      pitch: 'Join Sweetwater\'s workshop series and related discussion groups',
      atAGlance: ['Indigenous wisdom sharing', 'Right relation', 'Good fire'],
      avatarUrl: null,
      bannerUrl: null,
      badgeUrl: null,
      id: 26,
      planCount: 15,
      groupIds: [20866]
    }
  ]

  return groupPlans
}
