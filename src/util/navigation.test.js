import {
  removePostFromUrl,
  postUrl,
  gotoExternalUrl,
  editPostUrl,
  duplicatePostUrl,
  setQuerystringParam
} from './navigation'

describe('postUrl', () => {
  it('should default to displaying the all groups context', () => {
    const expected = '/all/post/123'
    const actual = postUrl('123')
    expect(actual).toEqual(expected)
  })

  it('should show a group context when group groupSlug is passed', () => {
    const expected = '/groups/awesome-team/post/123'
    const actual = postUrl('123', { context: 'groups', groupSlug: 'awesome-team' })
    expect(actual).toEqual(expected)
  })

  it('should show a group member context when memberId is passed in opts', () => {
    const expected = '/groups/awesome-team/members/321/post/123'
    const actual = postUrl('123', { context: 'groups', groupSlug: 'awesome-team', memberId: '321' })
    expect(actual).toEqual(expected)
  })

  it('should show a member context when memberId is passed in opts', () => {
    const expected = '/all/members/321/post/123'
    const actual = postUrl('123', { memberId: '321' })
    expect(actual).toEqual(expected)
  })

  it('should show a group topic context when topicName is passed in opts', () => {
    const expected = '/groups/awesome-team/topics/petitions/post/123'
    const actual = postUrl('123', { context: 'groups', view: 'topics', groupSlug: 'awesome-team', topicName: 'petitions' })
    expect(actual).toEqual(expected)
  })

  it('should show a topic context when topicName is passed in opts', () => {
    const expected = '/all/topics/petitions/post/123'
    const actual = postUrl('123', { context: 'all', view: 'topics', topicName: 'petitions' })
    expect(actual).toEqual(expected)
  })

  it('should concatenate an action path parameter when action is passed in opts', () => {
    const expected = '/all/post/123/action'
    const actual = postUrl('123', { context: 'all', action: 'action' })
    expect(actual).toEqual(expected)
  })
})

describe('removePostFromUrl', () => {
  it('should keep Post Module in URL', () => {
    const result = removePostFromUrl('/groups/somegroup/projects/post/1234')
    expect(result).toEqual('/groups/somegroup/projects')
  })

  it('should remove default Post route', () => {
    const result = removePostFromUrl('/groups/somegroup/post/1234')
    expect(result).toEqual('/groups/somegroup')
  })
})

describe('editPostUrl', () => {
  it('should return edit action URL with postId', () => {
    const result = editPostUrl('1234', { context: 'groups', groupSlug: 'test' })
    expect(result).toEqual('/groups/test/post/1234/edit')
  })
})

describe('duplicatePostUrl', () => {
  it('should return create action URL with postId query param fromPostId', () => {
    const result = duplicatePostUrl('1234', { context: 'groups', groupSlug: 'test' })
    expect(result).toEqual('/groups/test/create/post?fromPostId=1234')
  })
})

describe('gotoExternalUrl', () => {
  it('should keep Post Module in URL', () => {
    const jsDomWindowOpen = window.open
    window.open = jest.fn()
    const testUrl = 'https://google.com'
    gotoExternalUrl(testUrl)
    expect(window.open).toHaveBeenCalledWith(testUrl, null, 'noopener,noreferrer')
    window.open = jsDomWindowOpen
  })
})

describe('setQuerystringParam', () => {
  it('should add param while keeping search params', () => {
    const actual = setQuerystringParam('t', 'whatsit', { search: '?q=wisywig' })
    expect(actual).toEqual('q=wisywig&t=whatsit')
  })

  it('should replace param while keeping search params', () => {
    const actual = setQuerystringParam('t', 'whatsit', { search: '?q=wisywig&t=whosit' })
    expect(actual).toEqual('q=wisywig&t=whatsit')
  })

  it('take empty search and add param', () => {
    const actual = setQuerystringParam('t', 'whatsit', {})
    expect(actual).toEqual('t=whatsit')
  })
})
