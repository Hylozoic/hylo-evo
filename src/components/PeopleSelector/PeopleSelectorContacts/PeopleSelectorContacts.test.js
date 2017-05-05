import PeopleSelectorContacts from './PeopleSelectorContacts'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const contacts = [
    {
      id: '1',
      name: 'Wombat',
      avatarUrl: 'https://flargle.com',
      community: 'Wombats'
    },
    {
      id: '2',
      name: 'Aardvark',
      avatarUrl: 'https://argle.com',
      community: 'Aardvarks'
    },
    {
      id: '3',
      name: 'Ocelot',
      avatarUrl: 'https://wargle.com',
      community: 'Ocelots'
    }
  ]
  const wrapper = shallow(<PeopleSelectorContacts contacts={contacts} />)
  expect(wrapper).toMatchSnapshot()
})
