export function useEnsureGroupPlans () {
  const groupPlans = [
    {
      name: 'Hylo Supporter',
      packages: [
        {
          name: 'Sustainer',
          charge: 10,
          term: 'monthly',
          trial: null,
          discount: ['woo'],
          active: true
        },
        {
          name: 'Fan',
          charge: 60,
          term: 'annual',
          trial: null,
          discount: [],
          active: true
        },
        {
          name: 'Steward',
          charge: 240,
          term: 'annual',
          trial: null,
          discount: [],
          active: false
        }
      ],
      description: 'A lot of many many words, very exciting to talk about, yayayayay whooo',
      pitch: 'Support the running and stewardship of Hylo',
      atAGlance: ['Support Hylo', 'Open Source', 'Public Utility'],
      avatarUrl: null,
      bannerUrl: null,
      badgeUrl: null,
      groupIds: []
    },
    {
      name: 'Bioregional Supporter',
      packages: [
        {
          name: 'Fan',
          charge: 25,
          term: 'annual',
          trial: 604800000, //two weeks in milliseconds
          discount: [],
          active: true
        },
        {
          name: 'Sustainer',
          charge: 10,
          term: 'monthly',
          trial: null,
          discount: ['woo'],
          active: true
        }
      ],
      description: 'Collect funds for our bioregional organizing and collaborating',
      pitch: 'Fund our bioregional efforts!',
      atAGlance: ['Bioregional', 'self-organizing', 'community'],
      avatarUrl: null,
      bannerUrl: null,
      badgeUrl: null,
      groupIds: []
    },
    {
      name: 'Fire Is Sacred',
      packages: [
        {
          name: null,
          charge: 12,
          term: 'monthly',
          trial: null,
          discount: ['woo'],
          active: true
        }
      ],
      description: 'A very long and detailed description of what is happening, ayayayayayayasdyfaysdfyasdfyaysdfa iauhsfdiauh sfi asdfoash fd  aosidfjaoisjfdoiajsdfoi   aosidjfaoisjdfoiajsdofijaosidfj  faosdfjaiosdjfasf oasijdfoasjdff aosidfjaos',
      pitch: 'Join Sweetwater\'s workshop series and related discussion groups',
      atAGlance: ['Indigenous wisdom sharing', 'Right relation', 'Good fire'],
      avatarUrl: null,
      bannerUrl: null,
      badgeUrl: null,
      groupIds: []
    }
  ]

  return groupPlans
}
