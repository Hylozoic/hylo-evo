import Member from './Member'
import { shallow } from 'enzyme'
import { merge } from 'lodash'
import React from 'react'
import { RESP_ADMINISTRATION } from 'store/constants'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

const minProps = {
  group: { id: 1 },
  currentUser: { id: 1, memberships: [{ id: 1, groupId: 1, commonRoles: { items: [] } }] },
  member: {},
  goToPerson: () => {}
}

const renderComponent = (providedProps) => {
  const props = merge({}, minProps, providedProps)
  return shallow(<Member {...props} />)
}

describe('Member Component', () => {
  it('shows moderate button when current user is a moderator', () => {
    const view = renderComponent({ member: { memberships: [{ id: 1, groupId: 1, groupRoles: [{ name: 'role', emoji: '🏄' }] }], membershipCommonRoles: [{ id: 1, groupId: 1, userId: 1, commonRoleId: 1 }] }, currentUser: { id: 1 }, currentUserResponsibilities: [RESP_ADMINISTRATION] })
    expect(view.find('Dropdown')).toHaveLength(1)
  })

  it('hides moderate button when current user is not a moderator', () => {
    const view = renderComponent({ member: { moderatedGroupMemberships: [], groupRoles: [], commonRoles: { items: [] } } })
    expect(view.find('Dropdown')).toHaveLength(0)
  })
})
