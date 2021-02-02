import {
  removePostFromUrl,
  postUrl,
  gotoExternalUrl,
  contextSwitchingUrl,
} from './navigation'

describe('postUrl', () => {
  it('should default to displaying the all groups context', () => {
    const expected = '/all/p/123'
    const actual = postUrl('123')
    expect(actual).toEqual(expected)
  })

  it('should show a group context when group slug is passed', () => {
    const expected = '/g/awesome-team/p/123'
    const actual = postUrl('123', { groupSlug: 'awesome-team' })
    expect(actual).toEqual(expected)
  })

  it('should show a group member context when memberId is passed in opts', () => {
    const expected = '/g/awesome-team/m/321/p/123'
    const actual = postUrl('123', { groupSlug: 'awesome-team', memberId: '321' })
    expect(actual).toEqual(expected)
  })

  it('should show a member context when memberId is passed in opts', () => {
    const expected = '/m/321/p/123'
    const actual = postUrl('123', { memberId: '321' })
    expect(actual).toEqual(expected)
  })

  it('should show a group topic context when topicName is passed in opts', () => {
    const expected = '/g/awesome-team/petitions/p/123'
    const actual = postUrl('123', { groupSlug: 'awesome-team', topicName: 'petitions' })
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

describe('removePostFromUrl', () => {
  it('should keep Post Module in URL', () => {
    const result = removePostFromUrl('/g/somegroup/project/1234')
    expect(result).toEqual('/g/somegroup/project')
  })

  it('should remove default Post route', () => {
    const result = removePostFromUrl('/g/somegroup/p/1234')
    expect(result).toEqual('/g/somegroup')
  })
})

describe('contextSwitchingUrl', () => {
  it('should switch group contexts, preserving view', () => {
    expect(contextSwitchingUrl({ slug: 'newcomm' }, { slug: 'old' })).toEqual('/g/newcomm')
    expect(contextSwitchingUrl({ slug: 'newcomm' }, { slug: 'old', postId: 2 })).toEqual('/g/newcomm')

    expect(contextSwitchingUrl({ slug: 'newcomm' }, { slug: 'old', view: 'map' })).toEqual('/g/newcomm/map')
    expect(contextSwitchingUrl({ slug: 'newcomm' }, { slug: 'old', postTypeContext: 'project' })).toEqual('/g/newcomm/project')
    expect(contextSwitchingUrl({ slug: 'newcomm' }, { slug: 'old', postTypeContext: 'event' })).toEqual('/g/newcomm/event')
    expect(contextSwitchingUrl({ slug: 'newcomm' }, { slug: 'old', postTypeContext: 'project', postId: 2 })).toEqual('/g/newcomm/project')
    expect(contextSwitchingUrl({ slug: 'newcomm' }, { slug: 'old', postTypeContext: 'event', postId: 2 })).toEqual('/g/newcomm/event')

    expect(contextSwitchingUrl({ slug: 'newcomm' }, { networkSlug: 'old' })).toEqual('/g/newcomm')
    expect(contextSwitchingUrl({ networkSlug: 'newnet' }, { slug: 'old' })).toEqual('/n/newnet')

    expect(contextSwitchingUrl({ context: 'all' }, { networkSlug: 'newnet' })).toEqual('/all')
    expect(contextSwitchingUrl({ context: 'all' }, { networkSlug: 'newnet', postTypeContext: 'project' })).toEqual('/all/project')
    expect(contextSwitchingUrl({ context: 'all' }, { networkSlug: 'newnet', view: 'topics' })).toEqual('/all/topics')
    expect(contextSwitchingUrl({ context: 'all' }, { networkSlug: 'newnet', view: 'map' })).toEqual('/all/map')

    // :NOTE: this is handled by separate <Redirect> definitions
    // expect(contextSwitchingUrl({ context: 'all' }, { slug: 'newnet', view: 'members' })).toEqual('/all')
    // expect(contextSwitchingUrl({ context: 'public' }, { slug: 'newnet', view: 'members' })).toEqual('/public')
    // expect(contextSwitchingUrl({ context: 'public' }, { networkSlug: 'newnet', view: 'topics' })).toEqual('/public')

    expect(contextSwitchingUrl({ slug: 'newcomm' }, { networkSlug: 'newnet', topicName: 'stuff' })).toEqual('/g/newcomm/stuff')
    expect(contextSwitchingUrl({ context: 'all' }, { networkSlug: 'newnet', topicName: 'stuff' })).toEqual('/all/stuff')
    expect(contextSwitchingUrl({ context: 'public' }, { slug: 'newnet', topicName: 'stuff' })).toEqual('/public/stuff')

    expect(contextSwitchingUrl({ slug: 'newcomm' }, { networkSlug: 'newnet', personId: 2 })).toEqual('/g/newcomm/m/2')
    expect(contextSwitchingUrl({ context: 'all' }, { networkSlug: 'newnet', personId: 2 })).toEqual('/m/2')
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
