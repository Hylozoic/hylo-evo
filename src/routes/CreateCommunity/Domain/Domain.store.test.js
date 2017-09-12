import { fetchCommunityExists } from './Domain.store'

describe('Domain store', () => {
  it('should call fetchCommunityExists', () => {
    const slug = 'slug'
    expect(fetchCommunityExists(slug)).toMatchSnapshot()
  })
})
