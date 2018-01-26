import React from 'react'
import { shallow } from 'enzyme'
import Header, { calculateMaxShown, generateHeaderText, formatNames} from './Header'

describe('Header', () => {
  it('should match the latest snapshot', () => {
    const others = ['one', 'two', 'three']
    const props = {
      others
    }
    const wrapper = shallow(<Header {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('calculateMaxShown', () => {
  it('returns array length if showAll', () => {
    const showAll = true
    const otherParticipants = [1, 2, 3]
    const expected = otherParticipants.length
    expect(calculateMaxShown(showAll, otherParticipants)).toEqual(expected)
  })
  it('returns 0 if array is not truthy', () => {
    const showAll = false
    const expected = 0
    expect(calculateMaxShown(showAll, undefined)).toEqual(expected)
  })
  it('returns the array length if the characters do not sum to the max allowed characters', () => {
    const showAll = false
    const otherParticipants = ['Jo', 'Alex', 'Carmen']
    const maxCharacters = 20
    const expected = otherParticipants.length
    expect(calculateMaxShown(showAll, otherParticipants, maxCharacters)).toEqual(expected)
  })
  it('returns the first n names that have fewer than maxCharacters', () => {
    const showAll = false
    const otherParticipants = ['Jo Lupo', 'Alex Trebeck', 'Carmen Sandiego']
    const maxCharacters = 20
    const expected = 2
    expect(calculateMaxShown(showAll, otherParticipants, maxCharacters)).toEqual(expected)
  })
})

describe('generateHeaderText', () => {
  it("returns 'You' if there aren't otherParticipants ", () => {
    const otherParticipants = []
    const expected = 'You'
    expect(generateHeaderText(null, otherParticipants)).toEqual(expected)
  })
})

describe('formatNames', () => {
  it('returns an object with a joined array of all participants of participants.length is equal to maxShown', () => {
    const maxShown = 3
    const otherParticipants = ['a', 'b', 'c']
    const expected = {
      displayNames: otherParticipants.join(', ')
    }
    expect(formatNames(otherParticipants, maxShown)).toEqual(expected)
  })
  it('returns a truncated list of names, and a string of "n others" if maxShown is fewer than total participants', () => {
    const maxShown = 2
    const otherParticipants = ['a', 'b', 'c', 'd']
    const expected = {
      displayNames: 'a, b',
      andOthers: ' 2 others'
    }
    expect(formatNames(otherParticipants, maxShown)).toEqual(expected)
  })
})
