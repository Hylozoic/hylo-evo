import { mount, shallow } from 'enzyme'
import { pick } from 'lodash/fp'
import React from 'react'

import PeopleSelectorMatches from './PeopleSelectorMatches'
import { people } from 'routes/Messages/Messages.test.json'

const defaultProps = {
  addParticipant: () => {},
  setCurrentMatch: () => {},
  currentMatch: {},
  matches: []
}

it('matches the last snapshot', () => {
  const matches = people.map(p => ({
    ...pick([ 'id', 'name', 'avatarUrl' ], p),
    community: p.memberships[0].community.name
  }))
  const wrapper = shallow(
    <PeopleSelectorMatches
      {...defaultProps}
      currentMatch={people[0]}
      matches={matches}
    />
  )
  expect(wrapper).toMatchSnapshot()
})

it('calls addParticipant with correct id when item clicked', () => {
  const addParticipant = jest.fn()
  const matches = [ { id: '1' }, { id: '2' } ]
  const wrapper = shallow(
    <PeopleSelectorMatches
      {...defaultProps}
      addParticipant={addParticipant}
      matches={matches}
    />
  )
  wrapper.find('PersonListItem').first().simulate('click')
  expect(addParticipant).toBeCalledWith(matches[0])
})

it('calls setCurrentMatch with correct id when item moused over', () => {
  const setCurrentMatch = jest.fn()
  const matches = [ { id: '1' }, { id: '2' } ]
  const wrapper = mount(
    <PeopleSelectorMatches
      {...defaultProps}
      setCurrentMatch={setCurrentMatch}
      matches={matches} />
  )
  wrapper.find('li').last().simulate('mouseOver')
  expect(setCurrentMatch).toBeCalledWith(matches[1])
})
