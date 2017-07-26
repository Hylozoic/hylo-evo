import Members, { twoByTwo } from './Members'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<Members members={[
    {id: '1', name: 'You'},
    {id: '2', name: 'Me'},
    {id: '3', name: 'Everyone'}
  ]} />)
  expect(wrapper.find('Connect(Member)')).toHaveLength(3)
})

describe('twoByTwo', () => {
  it('works', () => {
    expect(twoByTwo([1, 2, 3, 4, 5, 6, 7])).toEqual([
      [1, 2],
      [3, 4],
      [5, 6],
      [7]
    ])
  })
})
