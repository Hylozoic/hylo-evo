import { getParticipants, getOthers } from './Header.store'

describe('getParticipants', () => {
  it('gets the participants from props.thread', () => {
    const participants = ['first', 'second', 'third']
    const props = {
      thread: {
        participants
      }
    }
    expect(getParticipants(props)).toEqual(participants)
  })
  it('returns an empty array if a thread does not exist', () => {
    const props = {
      thread: null
    }
    expect(getParticipants(props)).toEqual([])
  })
})

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
    const props = {
      currentUser: {id: 1}
    }
    expect(getOthers(props, participants)).toEqual(['two', 'three'])
  })
})
