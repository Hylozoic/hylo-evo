import NetworkCommunitySettings, { CommunityModeratorSection, CommunityModerator } from './NetworkCommunitySettings'
import { shallow } from 'enzyme'
import React from 'react'
import { omit } from 'lodash/fp'

describe('NetworkCommunitySettings', () => {
  let props

  beforeEach(() => {
    props = {
      fetchCommunitySettings: jest.fn(),
      moderators: [],
      community: {id: 1}
    }
  })

  it('matches the previous snapshot and calls fetchCommunitySettings', () => {
    const wrapper = shallow(<NetworkCommunitySettings {...props} />)
    expect(wrapper).toMatchSnapshot()
    expect(props.fetchCommunitySettings).toHaveBeenCalled()
  })

  it('matches the previous snapshot when no community', () => {
    const wrapper = shallow(<NetworkCommunitySettings {...omit('community', props)} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityModeratorSection', () => {
  let props

  beforeEach(() => {
    props = {
      moderators: [1, 2, 3],
      slug: 'cslug'
    }
  })

  it('matches the previous snapshot', () => {
    const wrapper = shallow(<CommunityModeratorSection {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('CommunityModerator', () => {
  let props

  beforeEach(() => {
    props = {
      moderator: {
        id: 1,
        name: 'Jar',
        avatarUrl: 'jarpic.png'
      },
      slug: 'cslug'
    }
  })

  it('matches the previous snapshot', () => {
    const wrapper = shallow(<CommunityModerator {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
