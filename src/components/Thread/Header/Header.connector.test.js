import { mapStateToProps } from './Header.connector'
describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const participants = [
      {name: 'one', id: 1},
      {name: 'two', id: 2},
      {name: 'three', id: 3}
    ]

    const thread = {
      id: 1,
      participants
    }
    const props = {
      currentUser: {id: 1},
      thread,
      threadId: thread.id
    }
    expect(mapStateToProps({}, props)).toMatchSnapshot()
  })
})
