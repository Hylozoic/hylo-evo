import {
  removePostFromUrl,
  postUrl,
  gotoExternalUrl,
  editPostUrl,
  duplicatePostUrl,
  setQuerystringParam,
  removeGroupFromUrl,
  createUrl,
  postCommentUrl,
  messagePersonUrl,
  isPublicPath,
  isMapView,
  isGroupsView,
  origin
} from './navigation'
import { host } from 'config'

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

  it('should show the public group when public group groupSlug is passed', () => {
    const expected = '/public/post/123'
    const actual = postUrl('123', { groupSlug: 'public' })
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

describe('removeGroupFromUrl', () => {
  it('should remove group/slug from groupDetail URL', () => {
    const result = removeGroupFromUrl('/groups/test/group/test')
    expect(result).toEqual('/groups/test')
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

describe('origin with windows === undefined', () => {
  const { window } = global
  beforeAll(() => {
    delete global.window
  })

  afterAll(() => {
    global.window = window
  })

  it('returns host', () => {
    const actual = origin()
    expect(actual).toEqual(host)
  })
})

describe('origin with windows !== undefined', () => {
  it('returns window.location.origin', () => {
    const actual = origin()
    expect(actual).toEqual(window.location.origin)
  })
})

describe('createUrl', () => {
  it('returns correct location', () => {
    const expected = '/my/create?lat=1.23456&lng=6.54321'
    const actual = createUrl({ context: 'my' }, { lat: '1.23456', lng: '6.54321' })
    expect(actual).toEqual(expected)
  })
})

describe('postCommentUrl', () => {
  it('returns correct path', () => {
    const expected = '/all/post/123/comments/456'
    const actual = postCommentUrl({ postId: '123', commentId: '456' })
    expect(actual).toEqual(expected)
  })
})

describe('messagePersonUrl', () => {
  it('returns message thread path without participant search param', () => {
    const expected = '/messages/456'
    const actual = messagePersonUrl({ id: '123', messageThreadId: '456' })
    expect(actual).toEqual(expected)
  })

  it('returns new messages path when no messageThreadId', () => {
    const expected = '/messages/new?participants=123'
    const actual = messagePersonUrl({ id: '123' })
    expect(actual).toEqual(expected)
  })
})

describe('is* functions', () => {
  it('identifies map view (isMapView)', () => {
    expect(isMapView('something/map/else')).toBe(true)
    expect(isMapView('something/else')).toBe(false)
  })

  it('identifies group view (isGroupView', () => {
    expect(isGroupsView('something/groups/else')).toBe(true)
    expect(isGroupsView('something/else')).toBe(false)
  })

  it('identifies public path (isPublicPath', () => {
    expect(isPublicPath('/public/something/else')).toBe(true)
    expect(isPublicPath('something/public/else')).toBe(false)
    expect(isPublicPath('something/else/public')).toBe(false)
  })
})
