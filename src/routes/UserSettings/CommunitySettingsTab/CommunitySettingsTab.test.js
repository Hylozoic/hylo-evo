import Affiliation from 'components/Affiliation'
import CommunitySettingsTab from './CommunitySettingsTab'
import Membership from 'components/Membership'
import { shallow } from 'enzyme'
import React from 'react'

describe('CommunitySettingsTab', () => {
  it('renders a list of Memberships', () => {
    const props = {
      memberships: [
        { id: "1", hasModeratorRole: true }, 
        { id: "2", hasModeratorRole: true }, 
        { id: "3", hasModeratorRole: true }, 
        ],
      affiliations: {
        items: [
          {
            id: "1",
            role: "Cheesemonger",
            preposition: "at",
            orgName: "La Fromagerie",
            url: "https://www.lafromagerie.com",
            isActive: true
          },
          {
            id: "2",
            role: "Organizer",
            preposition: "of",
            orgName: "Rights of Nature Santa Cruz",
            url: "https://rightsofnaturesc.org",
            isActive: true
          }
        ]
      },
      updateAllCommunities: () => {},
      fetchForCurrentUser: jest.fn(() => Promise.resolve({ id: 'validUser' }))
    }

    const wrapper = shallow(<CommunitySettingsTab {...props } />)
    expect(wrapper.find('Membership').length).toEqual(3)
    expect(wrapper.find('Affiliation').length).toEqual(2)
    expect(wrapper).toMatchSnapshot()
  })
})
