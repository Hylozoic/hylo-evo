import RelatedGroupsTab, { GroupCard } from './RelatedGroupsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('RelatedGroupstab', () => {
  it('renders correctly', () => {
    const parentGroups = [
      { id: 9 }, { id: 8 }, { id: 7 }
    ]
    const childGroups = [
      { id: 6 }, { id: 5 }, { id: 4 }
    ]
    const group = { id: 1, name: 'Best Group' }
    const wrapper = shallow(<RelatedGroupsTab
      group={group}
      parentGroups={parentGroups}
      childGroups={childGroups}
      fetchGroupToGroupJoinQuestions={() => {}}
      groupInvitesToJoinUs={[]}
      groupRequestsToJoinUs={[]}
      groupInvitesToJoinThem={[]}
      groupRequestsToJoinThem={[]}
      possibleParents={[]}
      possibleChildren={[]}
      deleteGroupRelationship={() => {}}
      inviteGroupToJoinParent={() => {}}
      requestToAddGroupToParent={() => {}}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('GroupsCard', () => {
  it('renders correctly', () => {
    const group = {
      name: 'Foom',
      avatarUrl: 'foom.png',
      numMembers: 77
    }
    const wrapper = shallow(<GroupCard
      group={group} />)
    expect(wrapper).toMatchSnapshot()
  })
})
