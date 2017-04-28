import { shallow } from 'enzyme'
import React from 'react'

import PeopleSelector from './PeopleSelector'

it('matches the last snapshot', () => {
  const matches = [
    { id: '1', name: 'Wombat' },
    { id: '2', name: 'Aardvark' }
  ]
  const wrapper = shallow(
    <PeopleSelector
      deleteMatch={jest.fn()} 
      fetchPeople={jest.fn()}
      matches={matches} />
  )
  expect(wrapper).toMatchSnapshot()
})
