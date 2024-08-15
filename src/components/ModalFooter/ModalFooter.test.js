import React from 'react'
import { shallow } from 'enzyme'
import ModalFooter from './ModalFooter'

describe('ModalFooter', () => {
  it('renders correctly without a "Previous" button', () => {
    const showPrevious = false
    const continueText = 'continueText'
    const wrapper = shallow(<ModalFooter
      continueText={continueText}
      showPrevious={showPrevious}
      previous={jest.fn()}
      submit={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly with a "Previous" button', () => {
    const continueText = 'continueText'
    const wrapper = shallow(<ModalFooter
      continueText={continueText}
      previous={jest.fn()}
      submit={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
