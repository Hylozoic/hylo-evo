import { shallow } from 'enzyme'
import React from 'react'

import PeopleSelector from './PeopleSelector'

it('matches the last snapshot', () => {
  const matches = [
    {
      id: '1',
      name: 'Wombat'
    },
    {
      id: '2',
      name: 'Aardvark'
    }
  ]
  const wrapper = shallow(<PeopleSelector matches={matches} deleteMatch={jest.fn()} />)
  expect(wrapper).toMatchSnapshot()
})
