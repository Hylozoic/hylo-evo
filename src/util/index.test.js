import { removePostFromUrl } from './index'

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