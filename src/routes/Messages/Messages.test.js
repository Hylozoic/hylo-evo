import Messages from './Messages'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const match = { params: { threadId: '1' } }
  const wrapper = shallow(<Messages match={match} />)
  expect(wrapper).toMatchSnapshot()
})

// import { shallow } from 'enzyme'
// import React from 'react'

// describe('Thread', () => {
//   it('matches the last snapshot', () => {
//     const thread = {id: '1'}
//     const wrapper = shallow(<Thread thread={thread} fetchThread={jest.fn()} id='1' />, { disableLifecycleMethods: true })
//     expect(wrapper).toMatchSnapshot()
//   })
// })
