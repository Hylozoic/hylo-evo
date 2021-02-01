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
        return null
      }
    })
    expect(linkedinPrompt()).toEqual(undefined)
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
    expect(wrapper.text()).toEqual('A Social ControlUnlink')
  })

  it('calls linkClicked when link is clicked', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' />)
    wrapper.instance().linkClicked = jest.fn()
    wrapper.find('[data-stylename="link-button"]').simulate('click')
    expect(wrapper.instance().linkClicked).toHaveBeenCalled()
  })

  it('calls unlinkClicked when unlink is clicked', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' value='someurl.com' />)
    wrapper.instance().unlinkClicked = jest.fn()
    wrapper.find('[data-stylename="link-button"]').simulate('click')
    expect(wrapper.instance().unlinkClicked).toHaveBeenCalled()
  })

  describe('linkClicked', () => {
    it('calls the right things when provider is twitter', () => {
      const provider = 'twitter'
      const onLink = () => 'thetwittername'
      const updateUserSettings = jest.fn()
      const onChange = jest.fn()
      const wrapper = shallow(<SocialControl
        label='A Social Control'
        provider={provider}
        onLink={onLink}
        updateUserSettings={updateUserSettings}
        onChange={onChange} />)

      wrapper.instance().linkClicked()
      expect(updateUserSettings).toHaveBeenCalledWith({ twitterName: 'thetwittername' })
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('calls exits if onLink returns null when provider is twitter', () => {
      const provider = 'twitter'
      const onLink = () => null
      const updateUserSettings = jest.fn()
      const onChange = jest.fn()
      const wrapper = shallow(<SocialControl
        label='A Social Control'
        provider={provider}
        onLink={onLink}
        updateUserSettings={updateUserSettings}
        onChange={onChange} />)

      wrapper.instance().linkClicked()
      expect(updateUserSettings).not.toHaveBeenCalledWith()
      expect(onChange).toHaveBeenCalledWith(false)
    })

    it('calls the right things when provider is not twitter', async () => {
      const provider = 'facebook'
      const onLink = () => Promise.resolve({ error: false })
      const updateUserSettings = jest.fn()
      const onChange = jest.fn()
      const wrapper = shallow(<SocialControl
        label='A Social Control'
        provider={provider}
        onLink={onLink}
        updateUserSettings={updateUserSettings}
        onChange={onChange} />)

      await wrapper.instance().linkClicked()
      expect(updateUserSettings).not.toHaveBeenCalledWith()
      expect(onChange).toHaveBeenCalledWith(true)
    })

    it('calls onChange with false on error when provider is not twitter', async () => {
      const provider = 'facebook'
      const onLink = () => Promise.resolve({ error: true })
      const updateUserSettings = jest.fn()
      const onChange = jest.fn()
      const wrapper = shallow(<SocialControl
        label='A Social Control'
        provider={provider}
        onLink={onLink}
        updateUserSettings={updateUserSettings}
        onChange={onChange} />)

      await wrapper.instance().linkClicked()
      expect(updateUserSettings).not.toHaveBeenCalledWith()
      expect(onChange).toHaveBeenCalledWith(false)
    })
  })

  describe('unlinkClicked', () => {
    const provider = 'linkedin'
    const unlinkAccount = jest.fn()
    const onChange = jest.fn()
    const wrapper = shallow(<SocialControl
      label='A Social Control'
      provider={provider}
      unlinkAccount={unlinkAccount}
      onChange={onChange} />)
    wrapper.instance().unlinkClicked()
    expect(unlinkAccount).toHaveBeenCalledWith(provider)
    expect(onChange).toHaveBeenCalledWith(false)
  })
})
