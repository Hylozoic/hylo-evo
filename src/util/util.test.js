import { postUrl } from './index'

describe('postUrl', () => {
  it('should default to displaying the all communities context', () => {
    const expected = '/all/p/123'
    const actual = postUrl('123')
    expect(actual).toEqual(expected)
  })

  it('should show a community context when community slug is passed', () => {
    const expected = '/c/awesome-team/p/123'
    const actual = postUrl('123', 'awesome-team')
    expect(actual).toEqual(expected)
  })

  it('should show a community member context when memberId is passed in opts', () => {
    const expected = '/c/awesome-team/m/321/p/123'
    const actual = postUrl('123', 'awesome-team', {memberId: '321'})
    expect(actual).toEqual(expected)
  })

  it('should show a member context when memberId is passed in opts', () => {
    const expected = '/m/321/p/123'
    const actual = postUrl('123', null, {memberId: '321'})
    expect(actual).toEqual(expected)
  })

  it('should show a community topic context when topicName is passed in opts', () => {
    const expected = '/c/awesome-team/petitions/p/123'
    const actual = postUrl('123', 'awesome-team', {topicName: 'petitions'})
    expect(actual).toEqual(expected)
  })

  it('should show a topic context when topicName is passed in opts', () => {
    const expected = '/all/petitions/p/123'
    const actual = postUrl('123', null, {topicName: 'petitions'})
    expect(actual).toEqual(expected)
  })
})
