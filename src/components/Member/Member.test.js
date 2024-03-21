import Member from './Member'
import { shallow } from 'enzyme'
import { merge } from 'lodash'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

const minProps = {
  group: { id: 1 },
  member: {},
  goToPerson: () => {}
}

const renderComponent = (providedProps) => {
  const props = merge({}, minProps, providedProps)
  return shallow(<Member {...props} />)
}

describe('Member Component', () => {
  it('shows moderate button when a moderator', () => {
    const wrapper = renderComponent({ member: { moderatedGroupMemberships: [], groupRoles: [{ name: 'role', emoji: '🏄' }], commonRoles: {items:[]} }, canModerate: true })
    expect(wrapper.find('Dropdown')).toHaveLength(1)
  })

  it('hides moderate button when not a moderator', () => {
    const wrapper = renderComponent({ member: { moderatedGroupMemberships: [], groupRoles: [], commonRoles: {items:[]} }, canModerate: false })
    expect(wrapper.find('Dropdown')).toHaveLength(0)
  })
})
