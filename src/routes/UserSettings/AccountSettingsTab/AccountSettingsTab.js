import PropTypes from 'prop-types'
import React, { Component } from 'react'
import SettingsControl from 'components/SettingsControl'
import './AccountSettingsTab.scss'
import Button from 'components/Button'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import cx from 'classnames'
import { DEFAULT_BANNER } from 'store/models/Me'
const { object, func } = PropTypes

const twitterPrompt = () => window.prompt('Please enter your twitter name.')
export function linkedinPrompt (prompt) {
  var url = window.prompt(prompt || 'Please enter the full url for your LinkedIn page.')
  if (url) {
    if (validateLinkedin(url)) {
      return url
    } else {
      return linkedinPrompt('Invalid url. Please enter full url for your LinkedIn page.')
    }
  }
}

export const validateLinkedin = url => url.match(/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com/)

export default class AccountSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func,
    loginWithService: func
  }
  constructor (props) {
    super(props)
    this.state = { edits: {}, changed: false }
  }

  componentDidMount () {
    this.setEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.fetchPending && !this.props.fetchPending) {
      this.setEditState()
    }
  }

  setEditState () {
    const { currentUser } = this.props
    if (!currentUser) return

    const {
      name, avatarUrl, bannerUrl, tagline, bio, locationId, location, email, url, facebookUrl, twitterName, linkedinUrl
    } = currentUser

    this.setState({
      edits: {
        name: name || '',
        avatarUrl: avatarUrl || '',
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        tagline: tagline || '',
        bio: bio || '',
        location: location || '',
        locationId: locationId || null,
        email: email || '',
        url: url || '',
        facebookUrl,
        twitterName,
        linkedinUrl
      }
    })
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state
    setChanged && this.props.setConfirm('You have unsaved changes, are you sure you want to leave?')

    if (key === 'location') {
      edits['location'] = event.target.value.fullText
      edits['locationId'] = event.target.value.id
    } else {
      edits[key] = event.target.value
    }

    this.setState({
      changed: setChanged ? true : changed,
      edits: { ...edits }
    })
  }

  updateSettingDirectly = (key, changed) => value =>
    this.updateSetting(key, changed)({ target: { value } })

  save = () => {
    this.setState({ changed: false })
    this.props.setConfirm(false)
    this.props.updateUserSettings(this.state.edits)
  }

  render () {
    const {
      currentUser,
      updateUserSettings,
      loginWithService,
      unlinkAccount
    } = this.props
    if (!currentUser) return <Loading />

    const { edits, changed } = this.state
    const {
      name, avatarUrl, bannerUrl, tagline, bio, location, email, url, facebookUrl, twitterName, linkedinUrl
    } = edits
    const locationObject = currentUser.locationObject

    return <div>
      <input type='text' styleName='name' onChange={this.updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <UploadAttachmentButton
          type='userBanner'
          id={currentUser.id}
          attachmentType='image'
          update={this.updateSettingDirectly('bannerUrl')}
          styleName='change-banner-button' />
      </div>
      <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
        <UploadAttachmentButton
          type='userAvatar'
          id={currentUser.id}
          attachmentType='image'
          update={this.updateSettingDirectly('avatarUrl')}
          styleName='change-avatar-button' />
      </div>
      <SettingsControl label='Tagline' onChange={this.updateSetting('tagline')} value={tagline} maxLength={60} />
      <SettingsControl label='About Me' onChange={this.updateSetting('bio')} value={bio} type='textarea' />
      <SettingsControl
        label='Location'
        onChange={this.updateSettingDirectly('location', true)}
        location={location}
        locationObject={locationObject}
        type='location'
      />
      <SettingsControl label='Email' onChange={this.updateSetting('email')} value={email} />
      <SettingsControl label='Website' onChange={this.updateSetting('url')} value={url} />
      <label styleName='social-label'>Social Accounts</label>
      <SocialControl
        label='Facebook'
        onLink={() => loginWithService('facebook')}
        onChange={this.updateSettingDirectly('facebookUrl', false)}
        unlinkAccount={unlinkAccount}
        provider='facebook'
        value={facebookUrl} />
      <SocialControl
        label='Twitter'
        onLink={() => twitterPrompt()}
        onChange={this.updateSettingDirectly('twitterName', false)}
        unlinkAccount={unlinkAccount}
        provider='twitter'
        value={twitterName}
        updateUserSettings={updateUserSettings} />
      <SocialControl
        label='LinkedIn'
        onLink={() => linkedinPrompt()}
        unlinkAccount={unlinkAccount}
        onChange={this.updateSettingDirectly('linkedinUrl', false)}
        provider='linkedin'
        value={linkedinUrl}
        updateUserSettings={updateUserSettings} />
      <div styleName='button-row'>
        <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? this.save : null} styleName='save-button' />
      </div>
    </div>
  }
}

export const socialLinkClicked = provider => {}

export class SocialControl extends Component {
  linkClicked () {
    const { provider, onLink, updateUserSettings, onChange } = this.props

    if (provider === 'twitter' || provider === 'linkedin') {
      const key = provider === 'twitter' ? 'twitterName' : 'linkedinUrl'
      const value = onLink()
      if (!value) return onChange(false)
      updateUserSettings({ [key]: value })
      return onChange(true)
    } else {
      return onLink()
        .then(({ error }) => {
          if (error) return onChange(false)
          return onChange(true)
        })
    }
  }

  unlinkClicked () {
    const { provider, unlinkAccount, onChange } = this.props
    unlinkAccount(provider)
    return onChange(false)
  }

  render () {
    const { label, value = '' } = this.props
    const linked = !!value

    const linkButton = <span
      styleName='link-button'
      onClick={linked ? () => this.unlinkClicked() : () => this.linkClicked()}>
      {linked ? 'Unlink' : 'Link'}
    </span>
    return <div styleName='control'>
      <div styleName={cx('social-control-label', { linked })}>{label}{linkButton}</div>
    </div>
  }
}
