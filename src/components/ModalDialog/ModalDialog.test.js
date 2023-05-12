import React from 'react'
import { shallow } from 'enzyme'
import ModalDialog from './ModalDialog'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('ModalDialog', () => {
  let props

  beforeEach(() => {
    props = {
      backgroundImage: 'foo.png',
      cancelButtonAction: jest.fn(),
      closeOnSubmit: true,
      closeModal: jest.fn(),
      modalTitle: 'Wombats',
      notificationIconName: 'Star',
      showCancelButton: true,
      showSubmitButton: true,
      submitButtonAction: jest.fn(),
      style: {},
      submitButtonText: 'Square Poop',
      useNotificationFormat: false
    }
  })

  it('matches the last snapshot', () => {
    const wrapper = shallow(
      <ModalDialog {...props}>
        <div>Describe how awesome wombats are:</div>
        <input autofocus />
      </ModalDialog>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('matches the last snapshot (useNotificationFormat)', () => {
    props.useNotificationFormat = true
    const wrapper = shallow(
      <ModalDialog {...props}>
        <div>Yep, they're awesome alright.</div>
      </ModalDialog>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('invokes cancelButtonAction', () => {
    // Disable submit button to make node selection easier
    props.showSubmitButton = false
    const wrapper = shallow(<ModalDialog {...props} />)
    wrapper.find('Button').simulate('click')
    expect(props.cancelButtonAction).toHaveBeenCalled()
  })

  it('invokes submitButtonAction', () => {
    props.showCancelButton = false
    const wrapper = shallow(<ModalDialog {...props} />)
    wrapper.find('Button').simulate('click')
    expect(props.submitButtonAction).toHaveBeenCalled()
  })

  it('closes the dialog', () => {
    props.showCancelButton = false
    const wrapper = shallow(<ModalDialog {...props} />)
    wrapper.find('Button').simulate('click')
    expect(props.closeModal).toHaveBeenCalled()
  })

  it('does not close if closeOnSubmit is false', () => {
    props.closeOnSubmit = false
    props.showCancelButton = false
    const wrapper = shallow(<ModalDialog {...props} />)
    wrapper.find('Button').simulate('click')
    expect(props.closeModal).not.toHaveBeenCalled()
  })

  it('does not show an icon without useNotificationFormat', () => {
    const wrapper = shallow(<ModalDialog {...props} />)
    expect(wrapper.find('Icon[name="Star"]').length).toBe(0)
  })

  it('shows an icon with useNotificationFormat', () => {
    props.useNotificationFormat = true
    const wrapper = shallow(<ModalDialog {...props} />)
    expect(wrapper.find('Icon[name="Star"]').length).toBe(1)
  })

  it('does not show an image without useNotificationFormat', () => {
    const wrapper = shallow(<ModalDialog {...props} />)
    const { style } = wrapper.find('[data-stylename="popup-inner"]').first().props()
    expect(style).toEqual(props.style)
  })

  it('shows an image with useNotificationFormat', () => {
    props.useNotificationFormat = true
    const wrapper = shallow(<ModalDialog {...props} />)
    const { style } = wrapper.find('[data-stylename="popup-inner"]').first().props()
    expect(style.backgroundImage).toMatch(/foo.png/)
  })
})
