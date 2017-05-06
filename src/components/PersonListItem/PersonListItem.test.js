import PersonListItem from './PersonListItem'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const person = {
    active: true,
    id: '1',
    name: 'Wombat',
    avatarUrl: 'https://wombat.life'
  }
  const wrapper = shallow(<PersonListItem addMatch={() => {}} person={person} />)
  expect(wrapper).toMatchSnapshot()
})
