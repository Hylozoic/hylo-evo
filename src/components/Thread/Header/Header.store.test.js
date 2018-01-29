import { getOthers } from './Header.store'

describe('getOthers', () => {
  it('returns null without a currentUser', () => {
    const participants = [1, 2, 3]
    const props = {
      thread: {
        participants
      }
    }
    expect(getOthers(props)).toEqual(participants)
  })
  it("returns a full list of names except the currentUser's", () => {
    const participants = [
      {name: 'one', id: 1},
      {name: 'two', id: 2},
      {name: 'three', id: 3}
    ]
    const thread = {
      participants
    }
    const props = {
      currentUser: {id: 1},
      thread
    }
    expect(getOthers(props, participants)).toEqual(['two', 'three'])
  })
})
