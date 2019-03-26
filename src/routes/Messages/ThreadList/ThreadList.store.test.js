import { filterThreadsByParticipant } from './ThreadList.store'

describe('filterThreadsByParticipant', () => {
  it('works as expected', () => {
    const mockThread = names => {
      return {
        participants: {
          toRefArray: function () {
            return names.map(name => ({name}))
          }
        }
      }
    }

    const filter = filterThreadsByParticipant('fo')
    expect(filter(mockThread(['boxhead', 'footballface', 'tvnose']))).toBeTruthy()
    expect(filter(mockThread(['Fearsome Foe', 'jim jam']))).toBeTruthy()
    expect(filter(mockThread(['Tiresome toe', 'jim jam']))).toBeFalsy()

    const noFilter = filterThreadsByParticipant()
    expect(noFilter(mockThread(['whomever']))).toBeTruthy()
  })
})
