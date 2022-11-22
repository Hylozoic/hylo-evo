import React from 'react'
import { shallow } from 'enzyme'
import Affiliation from './Affiliation'

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

describe('Affiliation', () => {
  it('matches last snapshot', () => {
    const props = {
      affiliation: {
        id: '1',
        orgName: 'La Fromagerie',
        preposition: 'at',
        role: 'Cheesemonger',
        url: null,
        createdAt: '2020-12-09T23:01:17.431Z',
        updatedAt: '2020-12-09T23:01:17.431Z',
        isActive: true }
    }

    const wrapper = shallow(<Affiliation {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
