import CreateGroup from './CreateGroup'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('CreateGroup', () => {
  it('matches snapshot', () => {
    const wrapper = shallow(<CreateGroup />)
    expect(wrapper).toMatchSnapshot()
  })

  it('Allows for passing in initial name and slug via query parameters', () => {
    const wrapper = shallow(<CreateGroup initialName='Epic Name' initialSlug='bananaslug' />)
    expect(wrapper).toMatchSnapshot()
  })
})
