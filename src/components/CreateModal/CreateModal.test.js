import CreateModal from './CreateModal'
import { shallow } from 'enzyme'
import React from 'react'

describe('CreateModal', () => {
  it('renders with no props', () => {
    const wrapper = shallow(<CreateModal match={{ path: '' }} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('test close button with data', () => {
    const closeModal = jest.fn()
    const wrapper = shallow(
      <CreateModal closeModal={closeModal} match={{ path: '' }} />
    )
    const closeButton = wrapper.find('span').first()
    closeButton.simulate('click')
    expect(closeModal).toHaveBeenCalled()
  })
})
