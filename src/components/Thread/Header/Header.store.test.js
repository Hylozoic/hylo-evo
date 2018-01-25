import { getOthers } from './Header.store'

describe('getOthers', () => {
  it('returns null without a currentUser', () => {
    const props = {
      currentUser: null
    }
    expect(getOthers(props)).toEqual(null)
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
