import PropTypes from 'prop-types'
import React, { Component } from 'react'
import SettingsControl from 'components/SettingsControl'
import SkillsSection from 'components/SkillsSection'
import SkillsToLearnSection from 'components/SkillsToLearnSection'
import Button from 'components/Button'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import cx from 'classnames'
import { DEFAULT_BANNER } from 'store/models/Me'
import './EditProfileTab.scss'
import { ensureLocationIdIfCoordinate } from 'components/LocationInput/LocationInput.store'

const { object, func, string } = PropTypes

/** LinkedIn Url */
const validateLinkedinUrl = url => url.match(/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com/)

export const linkedinPrompt = () => {
  let linkedinUrl = window.prompt('Please enter the full url for your LinkedIn page.')

  if (linkedinUrl) {
    while (!validateLinkedinUrl(linkedinUrl)) {
      linkedinUrl = window.prompt('Invalid url. Please enter the full url for your LinkedIn page.')
    }
  }

  return linkedinUrl
}

/** Facebook Url */
const validateFacebookUrl = url => url.match(/^(http(s)?:\/\/)?([\w]+\.)?facebook\.com/)

export const facebookPrompt = () => {
  let facebookUrl = window.prompt('Please enter the full url for your Facebook page.')

  if (facebookUrl) {
    while (!validateFacebookUrl(facebookUrl)) {
      facebookUrl = window.prompt('Invalid url. Please enter the full url for your Facebook page.')
    }
  }

  return facebookUrl
}

export class SocialControl extends Component {
  static propTypes = {
    label: string,
    provider: string,
    value: string,
    updateSettingDirectly: func,
    handleUnlinkAccount: func,
    onLink: func,
    fetchLocation: func
  }

  handleLinkClick () {
    const { provider, updateSettingDirectly } = this.props

    switch (provider) {
      case 'twitter': {
        const twitterHandle = window.prompt('Please enter your twitter name.')
        if (twitterHandle) {
          updateSettingDirectly()(twitterHandle)
        }
        break
      }
      case 'linkedin': {
        const linkedinUrl = linkedinPrompt()
        if (linkedinUrl) {
          updateSettingDirectly()(linkedinUrl)
        }
        break
      }
      case 'facebook': {
        const facebookUrl = facebookPrompt()
        if (facebookUrl) {
          updateSettingDirectly()(facebookUrl)
        }
        break
      }
    }
  }

  handleUnlinkClick () {
    const { handleUnlinkAccount, updateSettingDirectly } = this.props

    handleUnlinkAccount()
    updateSettingDirectly()(null)
  }

  render () {
    const { label, value = '', provider, onLink } = this.props
    const linked = !!value

    const linkButton =
      <span
        styleName='link-button'
        onClick={linked ? () => this.handleUnlinkClick() : () => this.handleLinkClick()}>
        {linked ? 'Unlink' : 'Link'}

      </span>

    const connectFacebookButton =
      <span
        styleName='link-button'
        onClick={linked ? () => this.handleUnlinkClick() : () => onLink()}
        className='ml-auto'
      >
        {linked ? 'Disconnect' : 'Connect'}
      </span>

    return (
      <div styleName='control'>
        <div styleName={cx('social-control-label')}>
          {linked ? <Icon name='Complete' styleName='linkedIcon' /> : ''}
          {label}
          {provider === 'facebook' && connectFacebookButton}
          {linkButton}
        </div>
      </div>
    )
  }
}
export default class EditProfileTab extends Component {
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
      name, avatarUrl, bannerUrl, tagline, bio,
      contactEmail, contactPhone, locationId, location,
      url, facebookUrl, twitterName, linkedinUrl
    } = currentUser

    this.setState({
      edits: {
        name: name || '',
        avatarUrl: avatarUrl || '',
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        tagline: tagline || '',
        bio: bio || '',
        contactPhone: contactPhone || '',
        contactEmail: contactEmail || '',
        location: location || '',
        locationId: locationId || null,
        url: url || '',
        facebookUrl,
        twitterName,
        linkedinUrl
      }
    })
  }

  updateSetting = (key, setChanged = true) => async event => {
    const { fetchLocation, currentUser } = this.props
    const { edits, changed } = this.state
    setChanged && this.props.setConfirm('You have unsaved changes, are you sure you want to leave?')

    if (key === 'location') {
      edits['location'] = event.target.value.fullText
      edits['locationId'] = event.target.value.id
    } else {
      edits[key] = event.target.value
    }
    let coordinateLocationId
    if (edits.location !== currentUser.location) {
      coordinateLocationId = await ensureLocationIdIfCoordinate({ fetchLocation, location: this.state.edits.location, locationId: this.state.edits.locationId })
    }

    this.setState({
      changed: setChanged ? true : changed,
      edits: { ...edits, locationId: coordinateLocationId }
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
      fetchPending,
      currentUser,
      loginWithService,
      unlinkAccount
    } = this.props
    if (fetchPending || !currentUser) return <Loading />

    const { edits, changed } = this.state
    const {
      name, avatarUrl, bannerUrl, tagline, bio,
      contactEmail, contactPhone, location, url,
      facebookUrl, twitterName, linkedinUrl
    } = edits

    const locationObject = currentUser.locationObject

    return <div>
      <input type='text' styleName='name' onChange={this.updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <UploadAttachmentButton
          type='userBanner'
          id={currentUser.id}
          onSuccess={({ url }) => this.updateSettingDirectly('bannerUrl')(url)}
          styleName='change-banner-button' />
      </div>
      <UploadAttachmentButton
        type='userAvatar'
        id={currentUser.id}
        onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}
        styleName='change-avatar-button'
      >
        <div style={bgImageStyle(avatarUrl)} styleName='avatar'><Icon name='AddImage' styleName='uploadIcon' /></div>
      </UploadAttachmentButton>
      <SettingsControl label='Tagline' onChange={this.updateSetting('tagline')} value={tagline} maxLength={60} />
      <SettingsControl label='About Me' onChange={this.updateSetting('bio')} value={bio} type='textarea' />
      <SettingsControl
        label='Location'
        onChange={this.updateSettingDirectly('location', true)}
        location={location}
        locationObject={locationObject}
        type='location'
      />
      <SettingsControl label='Website' onChange={this.updateSetting('url')} value={url} />
      <SettingsControl label='My Skills &amp; Interests' renderControl={() =>
        <SkillsSection personId={currentUser.id} />} />
      <SettingsControl label='What I&apos;m learning' renderControl={() =>
        <SkillsToLearnSection personId={currentUser.id} />} />
      <SettingsControl label='Contact Email' onChange={this.updateSetting('contactEmail')} value={contactEmail} />
      <SettingsControl label='Contact Phone' onChange={this.updateSetting('contactPhone')} value={contactPhone} />
      <label styleName='social-label'>Social Accounts</label>
      <SocialControl
        label='Facebook'
        provider='facebook'
        value={facebookUrl}
        onLink={() => loginWithService('facebook')}
        updateSettingDirectly={() => this.updateSettingDirectly('facebookUrl')}
        handleUnlinkAccount={() => unlinkAccount('facebook')}
      />
      <SocialControl
        label='Twitter'
        provider='twitter'
        value={twitterName}
        updateSettingDirectly={() => this.updateSettingDirectly('twitterName')}
        handleUnlinkAccount={() => unlinkAccount('twitter')}
      />
      <SocialControl
        label='LinkedIn'
        provider='linkedin'
        value={linkedinUrl}
        updateSettingDirectly={() => this.updateSettingDirectly('linkedinUrl')}
        handleUnlinkAccount={() => unlinkAccount('linkedin')}
      />
      <div styleName='saveChanges'>
        <span styleName={changed ? 'settingChanged' : ''}>{changed ? 'Changes not saved' : 'Current settings up to date'}</span>
        <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? this.save : null} styleName='save-button' />
      </div>
    </div>
  }
}
