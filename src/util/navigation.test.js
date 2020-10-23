import {
  removePostFromUrl,
  postUrl,
  networkCommunitySettingsUrl,
  gotoExternalUrl
} from './navigation'

describe('postUrl', () => {
  it('should default to displaying the all communities context', () => {
    const expected = '/all/p/123'
    const actual = postUrl('123')
    expect(actual).toEqual(expected)
  })

  it('should show a community context when community slug is passed', () => {
    const expected = '/c/awesome-team/p/123'
    const actual = postUrl('123', { communitySlug: 'awesome-team' })
    expect(actual).toEqual(expected)
  })

  it('should show a community member context when memberId is passed in opts', () => {
    const expected = '/c/awesome-team/m/321/p/123'
    const actual = postUrl('123', { communitySlug: 'awesome-team', memberId: '321' })
    expect(actual).toEqual(expected)
  })

  it('should show a member context when memberId is passed in opts', () => {
    const expected = '/m/321/p/123'
    const actual = postUrl('123', { memberId: '321' })
    expect(actual).toEqual(expected)
  })

  it('should show a community topic context when topicName is passed in opts', () => {
    const expected = '/c/awesome-team/petitions/p/123'
    const actual = postUrl('123', { communitySlug: 'awesome-team', topicName: 'petitions' })
    expect(actual).toEqual(expected)
  })

  it('should show a topic context when topicName is passed in opts', () => {
    const expected = '/all/petitions/p/123'
    const actual = postUrl('123', { topicName: 'petitions' })
    expect(actual).toEqual(expected)
  })

  it('should concatenate an action path parameter when action is passed in opts', () => {
    const expected = '/all/p/123/action'
    const actual = postUrl('123', { action: 'action' })
    expect(actual).toEqual(expected)
  })
})

describe('networkCommunitySettingsUrl', () => {
  it('should default to displaying the all communities context', () => {
    const expected = '/n/nslug/settings/communities/cslug'
    const actual = networkCommunitySettingsUrl('nslug', 'cslug')
    expect(actual).toEqual(expected)
  })
})

describe('removePostFromUrl', () => {
  it('should keep Post Module in URL', () => {
    const result = removePostFromUrl('/c/somecommunity/project/1234')
    expect(result).toEqual('/c/somecommunity/project')
  })

  it('should remove default Post route', () => {
    const result = removePostFromUrl('/c/somecommunity/p/1234')
    expect(result).toEqual('/c/somecommunity')
  })
})

describe('gotoExternalUrl', () => {
  it('should keep Post Module in URL', () => {
    const jsDomWindowOpen = window.open
    window.open = jest.fn()
    const testUrl = 'https://google.com'
    gotoExternalUrl(testUrl)
    expect(open).toHaveBeenCalledWith(testUrl, null, "noopener,noreferrer")
    window.open = jsDomWindowOpen
  })
})
