import NetworkSettings from './NetworkSettings'
import { shallow } from 'enzyme'
import React from 'react'

import FullPageModal from 'routes/FullPageModal'

describe('NetworkSettings', () => {
  let props

  beforeEach(() => {
    props = {
      fetchCommunities: () => {},
      fetchNetworkSettings: () => {},
      isAdmin: true,
      isModerator: false,
      network: { id: 1, communities: [], moderators: [], slug: 'mycelium' },
      setConfirm: () => {},
      updateNetworkSettings: () => {}
    }
  })

  it('matches the previous snapshot', () => {
    const wrapper = shallow(<NetworkSettings {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('doesnt have the moderators tab if only a moderator', () => {
    props.isAdmin = false
    props.isModerator = true

    const wrapper = shallow(<NetworkSettings {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('prevents non-admin access', () => {
    props.isAdmin = false
    const wrapper = shallow(<NetworkSettings {...props} />)
    const actual = wrapper.find(FullPageModal).children()
    expect(actual.text()).toContain('must be an admin')
  })
})
