import React from 'react'
import { shallow } from 'enzyme'
import Messages from './Messages'

const testProps = {
  fetchMessages: () => {},
  createMessage: () => {},
  match: {
    params: {
      threadId: '1'
    }
  }
}

it('matches the last snapshot', () => {
  const wrapper = shallow(<Messages {...testProps} />, { disableLifecycleMethods: true })

  expect(wrapper).toMatchSnapshot()
})

// TODO: Test for participant query string
// describe('componentDidMount', () => {
//   it('adds particpants in the search, then clears it', () => {
//     const addParticipant = jest.fn()
//     const changeQuerystringParam = jest.fn()
//     mount(
//       <MemoryRouter>
//         <PeopleSelector
//           {...defaultProps}
//           addParticipant={addParticipant}
//           participantSearch={[ '1', '2' ]}
//           changeQuerystringParam={changeQuerystringParam} />
//       </MemoryRouter>
//     )
//     expect(addParticipant).toBeCalledWith('1')
//     expect(addParticipant).toBeCalledWith('2')
//     const [ _, param, value ] = changeQuerystringParam.mock.calls[0]
//     expect(param).toBe('participants')
//     expect(value).toBe(null)
//   })
// })

// TODO: Test for findOrCreateThread > createMessage
// describe('for a new thread', () => {
//   const mockFindOrCreateThread = jest.fn(() => Promise.resolve({
//     payload: { data: { findOrCreateThread: { id: 5 } } }
//   }))

//   const mockGoToThread = jest.fn()
//   const mockOnSubmit = jest.fn(() => Promise.resolve())

//   const wrapper = mount(<MessageForm
//     {...defaultProps}
//     forNewThread
//     findOrCreateThread={mockFindOrCreateThread}
//     goToThread={mockGoToThread}
//     text='hey you'
//     createMessage={mockOnSubmit}
//     sendIsTyping={jest.fn()} />)

//   it('finds or creates a thread', () => {
//     wrapper.find('textarea').simulate('keydown', { which: keyMap.ENTER })
//     expect.assertions(3)
//     return new Promise(resolve => {
//       setTimeout(() => {
//         expect(mockFindOrCreateThread).toHaveBeenCalled()
//         expect(mockOnSubmit).toHaveBeenCalled()
//         expect(mockGoToThread).toHaveBeenCalledWith(5)
//         resolve()
//       }, 100)
//     })
//   })
// })
