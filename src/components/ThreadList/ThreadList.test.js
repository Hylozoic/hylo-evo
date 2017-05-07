import ThreadList from './ThreadList'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const match = {params: {}}
  const wrapper = shallow(<ThreadList threads={[]} match={match} />)
  expect(wrapper).toMatchSnapshot()
})
