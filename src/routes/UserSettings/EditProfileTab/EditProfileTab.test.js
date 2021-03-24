import EditProfileTab, { SocialControl, linkedinPrompt } from './EditProfileTab'
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

describe('EditProfileTab', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<EditProfileTab currentUser={{}} />)
    expect(wrapper.find('Connect(UploadAttachmentButton)').length).toEqual(2)
    expect(wrapper.find('SettingsControl').length).toEqual(8)
    expect(wrapper.find('SocialControl').length).toEqual(3)
    expect(wrapper.find('Button').prop('color')).toEqual('gray')
    wrapper.setState({ changed: true })
    expect(wrapper.find('Button').prop('color')).toEqual('green')
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
        const updateSocialSetting = jest.fn()
        const handleUnlinkAccount = jest.fn()

        const wrapper = shallow(
          <SocialControl
            label='Twitter'
            provider='twitter'
            value='twitterhandle'
            updateSocialSetting={updateSocialSetting}
            handleUnlinkAccount={handleUnlinkAccount}
          />
        )

        wrapper.instance().handleLinkClick()
        expect(window.prompt).toBeCalledWith('Please enter your twitter name.');
        expect(updateSocialSetting).toHaveBeenCalledWith({ key: 'twitterName', value: 'twitterhandle' })
      })

      it('and handle is NOT entered, it does NOT update the twitterName', () => {
        window.prompt = jest.fn(() => false)
        const updateSocialSetting = jest.fn()
        const handleUnlinkAccount = jest.fn()

        const wrapper = shallow(
          <SocialControl
            label='Twitter'
            provider='twitter'
            value='twitterhandle'
            updateSocialSetting={updateSocialSetting}
            handleUnlinkAccount={handleUnlinkAccount}
          />
        )

        wrapper.instance().handleLinkClick()
        expect(window.prompt).toBeCalledWith('Please enter your twitter name.');
        expect(updateSocialSetting).not.toHaveBeenCalled()
      })
    })

    describe('when provider is linkedin', () => {
      it('and valid linkedinUrl is provided, it updates the linkedinUrl', () => {
        window.prompt = jest.fn(() => 'linkedin.com/test')
        const updateSocialSetting = jest.fn()
        const handleUnlinkAccount = jest.fn()

        const wrapper = shallow(
          <SocialControl
            label='LinkedIn'
            provider='linkedin'
            value='linkedin.com/test'
            updateSocialSetting={updateSocialSetting}
            handleUnlinkAccount={handleUnlinkAccount}
          />
        )

        wrapper.instance().handleLinkClick()
        expect(window.prompt).toBeCalledWith('Please enter the full url for your LinkedIn page.');
        expect(updateSocialSetting).toHaveBeenCalledWith({ key: 'linkedinUrl', value: 'linkedin.com/test' })
      })
    })

    // describe('when provider is facebook', () => {
    //   it('calls the right things when provider is facebook', async () => {
    //     const provider = 'facebook'
    //     const onLink = () => Promise.resolve({ error: false })
    //     const updateUserSettings = jest.fn()
    //     const onChange = jest.fn()
    //     const wrapper = shallow(<SocialControl
    //       label='A Social Control'
    //       provider={provider}
    //       onLink={onLink}
    //       updateUserSettings={updateUserSettings}
    //       onChange={onChange} />)

    //     await wrapper.instance().linkClicked()
    //     expect(updateUserSettings).not.toHaveBeenCalledWith()
    //     expect(onChange).toHaveBeenCalledWith(true)
    //   })
    // })
  })

  describe('handleUnlinkClick', () => {
    const handleUnlinkAccount = jest.fn()
    const updateSocialSetting = jest.fn()

    const wrapper = shallow(
      <SocialControl
        label='LinkedIn'
        provider='linkedin'
        value='linkedin.com/test'
        updateSocialSetting={updateSocialSetting}
        handleUnlinkAccount={handleUnlinkAccount}
      />
    )

    wrapper.instance().handleUnlinkClick()
    expect(handleUnlinkAccount).toHaveBeenCalled()
    expect(updateSocialSetting).toHaveBeenCalledWith({ key: 'linkedinUrl', value: '' })
  })
})
