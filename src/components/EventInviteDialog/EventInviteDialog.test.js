import EventInviteDialog, { InviteeRow, Search } from './EventInviteDialog'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

describe('EventInviteDialog', () => {
  it('renders correctly', () => {
    const props = {
      onClose: () => {},
      eventInvitations: [{ id: 1 }, { id: 2 }, { id: 3 }],
      people: [{ id: 1, name: 'a' }, { id: 4, name: 'b' }, { id: 5, name: 'c' }]
    }
    const wrapper = shallow(<EventInviteDialog {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('InviteeRow', () => {
  it('renders correctly', () => {
    const props = {
      person: { id: 1, name: 'j', avatarUrl: 'j.png', response: 'not needed' },
      selected: true,
      onClick: () => {}
    }
    const wrapper = shallow(<InviteeRow {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with showResposne', () => {
    const props = {
      person: { id: 1, name: 'j', avatarUrl: 'j.png', response: 'needed!' },
      selected: true,
      onClick: () => {},
      showResponse: true
    }
    const wrapper = shallow(<InviteeRow {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('Search', () => {
  it('renders correctly', () => {
    const props = {
      onChange: () => {}
    }
    const wrapper = shallow(<Search {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
