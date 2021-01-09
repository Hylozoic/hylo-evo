import { shallow } from 'enzyme'
import React from 'react'

import PeopleList from './PeopleList'

it('does something', () => {
  const people = [
    {
      id: '1',
      name: 'Wombat',
      avatarUrl: 'https://flargle.com',
      group: 'Wombats'
    },
    {
      id: '2',
      name: 'Aardvark',
      avatarUrl: 'https://argle.com',
      group: 'Aardvarks'
    },
    {
      id: '3',
      name: 'Ocelot',
      avatarUrl: 'https://wargle.com',
      group: 'Ocelots'
    }
  ]
  const wrapper = shallow(<PeopleList people={people} />)
  expect(wrapper).toMatchSnapshot()
})
