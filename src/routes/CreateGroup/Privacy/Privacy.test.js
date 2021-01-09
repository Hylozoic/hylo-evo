import React from 'react'
import { shallow } from 'enzyme'
import Privacy from './Privacy'

describe('Privacy', () => {
  it('renders correctly', () => {
    const groupPrivacy = 'groupPrivacy'

    const wrapper = shallow(<Privacy
      goToNextStep={jest.fn()}
      currentUser={{}}
      goToPreviousStep={jest.fn()}
      addGroupPrivacy={jest.fn()}
      groupPrivacy={groupPrivacy}
      goHome={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
