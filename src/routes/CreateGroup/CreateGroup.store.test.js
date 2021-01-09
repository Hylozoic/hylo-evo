import {
  addGroupName,
  addGroupPrivacy,
  addGroupDomain,
  fetchGroupExists
} from './CreateGroup.store'

describe('CreateGroup store', () => {
  it('should call addGroupName', () => {
    const groupName = 'name'
    expect(addGroupName(groupName)).toMatchSnapshot()
  })
  it('should call addGroupPrivacy', () => {
    const groupPrivacy = 'privacy'
    expect(addGroupPrivacy(groupPrivacy)).toMatchSnapshot()
  })
  it('should call addGroupDomain', () => {
    const groupDomain = 'domain'
    expect(addGroupDomain(groupDomain)).toMatchSnapshot()
  })
  it('should call fetchGroupExists', () => {
    const slug = 'slug'
    expect(fetchGroupExists(slug)).toMatchSnapshot()
  })
})
