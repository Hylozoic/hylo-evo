/* eslint no-unused-expressions: 'off' */
import EditProfileTab, { SocialControl, linkedinPrompt, facebookPrompt } from './EditProfileTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('linkedinPrompt', () => {
  var oldPrompt

  beforeAll(() => {
    oldPrompt = window.prompt
  })

  afterAll(() => {
    window.prompt = oldPrompt
  })

  it('returns a correct linkedIn Url', () => {
    const url = 'https://www.linkedin.com/in/username/'
    window.prompt = jest.fn(() => url)
    expect(linkedinPrompt()).toEqual(url)
  })

  it('rejects an incorrect linkedIn Url, calling itself again', () => {
    var count = 0
    window.prompt = jest.fn(() => {
      if (count === 0) {
        count += 1
        return 'a bad url'
      } else {
        count += 1
        return 'https://www.linkedin.com/in/username/'
      }
    })
    expect(linkedinPrompt()).toEqual('https://www.linkedin.com/in/username/')
    expect(count).toEqual(2)
    expect(window.prompt.mock.calls).toMatchSnapshot()
  })
})

describe('facebookPrompt', () => {
  var oldPrompt

  beforeAll(() => {
    oldPrompt = window.prompt
  })

  afterAll(() => {
    window.prompt = oldPrompt
  })

  it('returns a correct facebook Url', () => {
    const url = 'https://www.facebook.com/username/'
    window.prompt = jest.fn(() => url)
    expect(facebookPrompt()).toEqual(url)
  })

  it('rejects an incorrect facebook Url, calling itself again', () => {
    var count = 0
    window.prompt = jest.fn(() => {
      if (count === 0) {
        count += 1
        return 'a bad url'
      } else {
        count += 1
        return 'https://www.facebook.com/username/'
      }
    })
    expect(facebookPrompt()).toEqual('https://www.facebook.com/username/')
    expect(count).toEqual(2)
    expect(window.prompt.mock.calls).toMatchSnapshot()
  })
})

describe('EditProfileTab', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<EditProfileTab currentUser={{ name: 'Yay', locationObject: { id: 1 } }} />)
    expect(wrapper.find('Connect(UploadAttachmentButton)').length).toEqual(2)
    expect(wrapper.find('SettingsControl').length).toEqual(8)
    expect(wrapper.find('SocialControl').length).toEqual(3)
    expect(wrapper.find('Button').prop('color')).toEqual('gray')
    wrapper.setState({ changed: true })
    expect(wrapper.find('Button').prop('color')).toEqual('green')
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly without location object', () => {
    const wrapper = shallow(<EditProfileTab currentUser={{ }} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('SocialControl', () => {
  it('renders correctly without a value', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' />)
    expect(wrapper.text()).toEqual('A Social ControlLink')
  })

  it('renders correctly with a value', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' value='someurl.com' />)
    expect(wrapper.text()).toEqual('<Icon />A Social ControlUnlink')
  })

  it('calls handleLinkClick when link is clicked', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' />)
    wrapper.instance().handleLinkClick = jest.fn()
    wrapper.find("[data-stylename='link-button']").simulate('click')
    expect(wrapper.instance().handleLinkClick).toHaveBeenCalled()
  })

  it('calls handleUnlinkClick when unlink is clicked', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' value='someurl.com' />)
    wrapper.instance().handleUnlinkClick = jest.fn()
    wrapper.find("[data-stylename='link-button']").simulate('click')
    expect(wrapper.instance().handleUnlinkClick).toHaveBeenCalled()
  })

  describe('handleLinkClick', () => {
    describe('when provider is twitter', () => {
      it('and handle is entered, it updates the twitterName', () => {
        window.prompt = jest.fn(() => 'twitterhandle')
        const updateSettingDirectlyCallback = jest.fn()
        const updateSettingDirectly = jest.fn(() => updateSettingDirectlyCallback)
        const handleUnlinkAccount = jest.fn()

        const wrapper = shallow(
          <SocialControl
            label='Twitter'
            provider='twitter'
            value='twitterhandle'
            updateSettingDirectly={updateSettingDirectly}
            handleUnlinkAccount={handleUnlinkAccount}
          />
        )

        wrapper.instance().handleLinkClick()
        expect(window.prompt).toBeCalledWith('Please enter your twitter name.')
        expect(updateSettingDirectly).toHaveBeenCalled
        expect(updateSettingDirectlyCallback).toHaveBeenCalledWith('twitterhandle')
      })

      it('and handle is NOT entered, it does NOT update the twitterName', () => {
        window.prompt = jest.fn(() => false)
        const updateSettingDirectly = jest.fn(() => jest.fn())
        const handleUnlinkAccount = jest.fn()

        const wrapper = shallow(
          <SocialControl
            label='Twitter'
            provider='twitter'
            value='twitterhandle'
            updateSettingDirectly={updateSettingDirectly}
            handleUnlinkAccount={handleUnlinkAccount}
          />
        )

        wrapper.instance().handleLinkClick()
        expect(window.prompt).toBeCalledWith('Please enter your twitter name.')
        expect(updateSettingDirectly).not.toHaveBeenCalled()
      })
    })

    describe('when provider is linkedin', () => {
      it('and valid linkedinUrl is provided, it updates the linkedinUrl', () => {
        window.prompt = jest.fn(() => 'linkedin.com/test')
        const updateSettingDirectlyCallback = jest.fn()
        const updateSettingDirectly = jest.fn(() => updateSettingDirectlyCallback)
        const handleUnlinkAccount = jest.fn()

        const wrapper = shallow(
          <SocialControl
            label='LinkedIn'
            provider='linkedin'
            value='linkedin.com/test'
            updateSettingDirectly={updateSettingDirectly}
            handleUnlinkAccount={handleUnlinkAccount}
          />
        )

        wrapper.instance().handleLinkClick()
        expect(window.prompt).toBeCalledWith('Please enter the full url for your LinkedIn page.')
        expect(updateSettingDirectly).toHaveBeenCalled
        expect(updateSettingDirectlyCallback).toHaveBeenCalledWith('linkedin.com/test')
      })
    })

    describe('when provider is facebook', () => {
      it('and valid facebookUrl is provided, it updates the facebookUrl', () => {
        window.prompt = jest.fn(() => 'facebook.com/test')
        const updateSettingDirectlyCallback = jest.fn()
        const updateSettingDirectly = jest.fn(() => updateSettingDirectlyCallback)
        const handleUnlinkAccount = jest.fn()

        const wrapper = shallow(
          <SocialControl
            label='Facebook'
            provider='facebook'
            value='facebook.com/test'
            updateSettingDirectly={updateSettingDirectly}
            handleUnlinkAccount={handleUnlinkAccount}
          />
        )

        wrapper.instance().handleLinkClick()
        expect(window.prompt).toBeCalledWith('Please enter the full url for your Facebook page.')
        expect(updateSettingDirectly).toHaveBeenCalled
        expect(updateSettingDirectlyCallback).toHaveBeenCalledWith('facebook.com/test')
      })
    })
  })

  describe('handleUnlinkClick', () => {
    const handleUnlinkAccount = jest.fn()
    const updateSettingDirectlyCallback = jest.fn()
    const updateSettingDirectly = jest.fn(() => updateSettingDirectlyCallback)

    const wrapper = shallow(
      <SocialControl
        label='LinkedIn'
        provider='linkedin'
        value='linkedin.com/test'
        updateSettingDirectly={updateSettingDirectly}
        handleUnlinkAccount={handleUnlinkAccount}
      />
    )

    wrapper.instance().handleUnlinkClick()
    expect(handleUnlinkAccount).toHaveBeenCalled()
    expect(updateSettingDirectly).toHaveBeenCalled
    expect(updateSettingDirectlyCallback).toHaveBeenCalledWith(null)
  })
})
