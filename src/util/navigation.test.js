import {
  removePostFromUrl,
  postUrl,
  gotoExternalUrl,
  contextSwitchingUrl,
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

describe('contextSwitchingUrl', () => {
  it('should switch group contexts, preserving view', () => {
    expect(contextSwitchingUrl({ context: 'groups', groupSlug: 'newcomm' }, { context: 'groups', groupSlug: 'old' })).toEqual('/groups/newcomm')
    expect(contextSwitchingUrl({ context: 'groups', groupSlug: 'newcomm' }, { context: 'groups', groupSlug: 'old', postId: 2 })).toEqual('/groups/newcomm')

    expect(contextSwitchingUrl({ context: 'groups', groupSlug: 'newcomm' }, { context: 'groups', groupSlug: 'old', view: 'map' })).toEqual('/groups/newcomm/map')
    expect(contextSwitchingUrl({ context: 'groups', groupSlug: 'newcomm' }, { context: 'groups', groupSlug: 'old', view: 'projects' })).toEqual('/groups/newcomm/projects')
    expect(contextSwitchingUrl({ context: 'groups', groupSlug: 'newcomm' }, { context: 'groups', groupSlug: 'old', view: 'events', detail: 'post', postId: 2 })).toEqual('/groups/newcomm/events')

    expect(contextSwitchingUrl({ context: 'all' }, { context: 'groups', groupSlug: 'old' })).toEqual('/all')
    expect(contextSwitchingUrl({ context: 'all' }, { context: 'groups', groupSlug: 'old', view: 'topics' })).toEqual('/all/topics')
    expect(contextSwitchingUrl({ context: 'all' }, { context: 'groups', groupSlug: 'old', view: 'map' })).toEqual('/all/map')

    expect(contextSwitchingUrl({ context: 'groups', groupSlug: 'newcomm' }, { context: 'groups', groupSlug: 'old', view: 'topics', topicName: 'stuff' })).toEqual('/groups/newcomm/topics/stuff')
    expect(contextSwitchingUrl({ context: 'all' }, { context: 'groups', groupSlug: 'old', view: 'topics', topicName: 'stuff' })).toEqual('/all/topics/stuff')
    expect(contextSwitchingUrl({ context: 'public' }, { context: 'groups', groupSlug: 'old', view: 'topics', topicName: 'stuff' })).toEqual('/public/topics/stuff')

    expect(contextSwitchingUrl({ context: 'groups', groupSlug: 'newcomm' }, { context: 'groups', groupSlug: 'old', view: 'members', personId: 2 })).toEqual('/groups/newcomm/members')
    expect(contextSwitchingUrl({ context: 'all' }, { context: 'groups', groupSlug: 'old', view: 'members', personId: 2 })).toEqual('/all/members')
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
