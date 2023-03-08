import Member from './Member'
import { shallow } from 'enzyme'
import { merge } from 'lodash'
import React from 'react'

const minProps = {
  member: {},
  goToPerson: () => {}
}

const renderComponent = (providedProps) => {
  const props = merge({}, minProps, providedProps)
  return shallow(<Member {...props} />)
}

describe('Member Component', () => {
  it('shows moderate button when a moderator', () => {
    const wrapper = renderComponent({ member: { moderatedGroupMemberships: [], groupRoles: [] }, canModerate: true })
    expect(wrapper.find('Dropdown')).toHaveLength(1)
  })

  it('hides moderate button when not a moderator', () => {
    const wrapper = renderComponent({ member: { moderatedGroupMemberships: [], groupRoles: [] }, canModerate: false })
    expect(wrapper.find('Dropdown')).toHaveLength(0)
  })
})
