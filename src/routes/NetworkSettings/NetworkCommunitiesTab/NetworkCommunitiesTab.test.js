import NetworkCommunitiesTab, { NetworkCommunityRow, CommunityModeratorSection, CommunityModerator } from './NetworkCommunitiesTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('NetworkCommunitiesTab', () => {
  it('renders correctly', () => {
    const communitiySuggestions = [{id: 2, name: 'jomunity', avatarUrl: 'jo.png'}, {id: 3, name: 'samunity', avatarUrl: 'sam.png'}]

    const wrapper = shallow(<NetworkCommunitiesTab
      isModerator
      isAdmin
      communitiesPage={1}
      communitiesPageCount={2}
      communitiesPending={false}
      communityAutocompleteCandidates={communitiySuggestions}
      network={{id: 1}}
      setCommunitiesPage={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('renderNetworkCommunityRow', () => {
    it('returns a NetworkCommunityRow', () => {
      const wrapper = shallow(<NetworkCommunitiesTab
        isModerator
        isAdmin
        communitiesPage={1}
        communitiesPageCount={2}
        communitiesPending={false}
        communityAutocompleteCandidates={[]}
        network={{id: 1}}
        setCommunitiesPage={() => {}}
        updateCommunityHiddenSetting={() => {}} />)

      const community = {
        id: 1
      }

      wrapper.instance().setState({
        expandedCommunityId: community.id
      })
      expect(wrapper.instance().renderNetworkCommunityRow(community)).toMatchSnapshot()
    })
  })

})

describe('NetworkCommunityRow', () => {
  it('renders correctly', () => {
    const community = {
      id: 2,
      name: 'jomunity',
      avatarUrl: 'jo.png',
      moderators: {
        toModelArray: () => [{id: 2, name: 'jo', avatarUrl: 'jo.png'}, {id: 3, name: 'sam', avatarUrl: 'sam.png'}]
      }
    }

    const wrapper = shallow(<NetworkCommunityRow
      community={community}
      expanded
      toggleExpanded={() => {}}
      removeCommunityFromNetwork={() => {}}
      updateCommunityHiddenSetting={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityModeratorSection', () => {
  it('renders correctly', () => {
    const moderators = [{id: 2, name: 'jo', avatarUrl: 'jo.png'}, {id: 3, name: 'sam', avatarUrl: 'sam.png'}]

    const wrapper = shallow(<CommunityModeratorSection
      moderators={moderators}
      slug='jomunity' />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityModerator', () => {
  it('renders correctly', () => {
    const moderator = {id: 2, name: 'jo', avatarUrl: 'jo.png'}

    const wrapper = shallow(<CommunityModerator
      moderator={moderator}
      slug='jomunity' />)
    expect(wrapper).toMatchSnapshot()
  })
})
