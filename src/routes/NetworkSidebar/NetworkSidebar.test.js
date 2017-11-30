import React from 'react'
import { shallow } from 'enzyme'

import NetworkSidebar from './NetworkSidebar'

const network = {
  id: '1',
  name: 'Networky Network',
  slug: 'networky-network',
  description: 'Blarg blarg'
}

describe('NetworkSidebar', () => {
  it('matches the last snapshot', () => {
    const wrapper = shallow(<NetworkSidebar network={network} isAdmin />)
    expect(wrapper).toMatchSnapshot()
  })
})
