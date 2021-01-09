import { mount, shallow } from 'enzyme'
import { pick } from 'lodash/fp'
import React from 'react'

import MatchingPeopleList from './MatchingPeopleList'
import { people } from 'routes/Messages/Messages.test.json'

const defaultProps = {
  onClick: () => {},
  onMouseOver: () => {},
  currentMatch: {},
  matchingPeople: []
}

it('matches the last snapshot', () => {
  const matchingPeople = people.map(p => ({
    ...pick([ 'id', 'name', 'avatarUrl' ], p),
    group: p.memberships[0].group.name
  }))
  const wrapper = shallow(
    <MatchingPeopleList
      {...defaultProps}
      currentMatch={people[0]}
      matchingPeople={matchingPeople}
    />
  )
  expect(wrapper).toMatchSnapshot()
})

it('calls onClick with correct id when item clicked', () => {
  const onClick = jest.fn()
  const matchingPeople = [ { id: '1' }, { id: '2' } ]
  const wrapper = shallow(
    <MatchingPeopleList
      {...defaultProps}
      onClick={onClick}
      matchingPeople={matchingPeople}
    />
  )
  wrapper.find('PeopleListItem').first().simulate('click')
  expect(onClick).toBeCalledWith(matchingPeople[0])
})

it('calls onMouseOver with correct id when item moused over', () => {
  const onMouseOver = jest.fn()
  const matchingPeople = [ { id: '1' }, { id: '2' } ]
  const wrapper = mount(
    <MatchingPeopleList
      {...defaultProps}
      onMouseOver={onMouseOver}
      matchingPeople={matchingPeople} />
  )
  wrapper.find('li').last().simulate('mouseOver')
  expect(onMouseOver).toBeCalledWith(matchingPeople[1])
})
