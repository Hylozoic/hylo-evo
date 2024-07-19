import GroupCard from './GroupCard'
import { shallow } from 'enzyme'
import React from 'react'
const props = {
  group: {
    id: 1,
    name: 'A Great Cause',
    slug: 'great-cause',
    groupTopics: {
      toModelArray: () => [
        { topic: {
          name: 'Life',
          id: '1wooooop'
        } },
        { topic: {
          name: 'Love',
          id: '2wooooop'
        } },
        { topic: {
          name: 'Light',
          id: '3wooooop'
        } },
        { topic: {
          name: 'LOLS',
          id: '4wooooop'
        } }
      ]
    },
    description: 'the description ' +
      'the description ' +
      'the description ' +
      'the description ' +
      'the description '
  },
  expanded: false,
  memberships: [12, 24, 25, 346]
}

it('matches last snapshot', () => {
  const wrapper = shallow(<GroupCard {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('matches last snapshot with different config', () => {
  const differentProps = {
    ...props,
    constrained: true
  }
  const wrapper = shallow(<GroupCard {...differentProps} />)
  expect(wrapper).toMatchSnapshot()
})
