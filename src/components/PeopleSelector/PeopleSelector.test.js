import { mount, shallow } from 'enzyme'
import React from 'react'

import { keyMap } from 'util/textInput'
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

it('does not hit server when backspace is pressed', () => {
  const fetchPeople = jest.fn()
  const wrapper = mount(
    <PeopleSelector matches={[]} fetchPeople={fetchPeople} />
  )
  wrapper.find('input').first().simulate('keyDown', { keyCode: keyMap.BACKSPACE })
  expect(fetchPeople).not.toHaveBeenCalled()
})

it('hits server when keys other than backspace are pressed', () => {
  const fetchPeople = jest.fn()
  const wrapper = mount(
    <PeopleSelector matches={[]} fetchPeople={fetchPeople} setAutocomplete={jest.fn()} />
  )
  wrapper.find('input').first().simulate('keyDown', { keyCode: keyMap.SPACE })
  expect(fetchPeople).toHaveBeenCalled()
})
