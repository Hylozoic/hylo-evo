import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { get } from 'lodash/fp'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import SettingsControl from 'components/SettingsControl'
import SkillsSection from 'components/SkillsSection'
import SkillsToLearnSection from 'components/SkillsToLearnSection'
import Button from 'components/Button'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER } from 'store/models/Me'
import './EditProfileTab.scss'
import { ensureLocationIdIfCoordinate } from 'components/LocationInput/LocationInput.store'
import SocialControl from './SocialControl'

const { object, func } = PropTypes

export const validateName = name => name && name.match(/\S/gm)

class EditProfileTab extends Component {
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
      contactEmail, contactPhone, locationObject, location,
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
        locationId: get('id', locationObject) || null,
        url: url || '',
        facebookUrl,
        twitterName,
        linkedinUrl
      }
    })
  }

  updateSetting = (key, setChanged = true) => async event => {
    const { fetchLocation, t } = this.props
    const { edits, changed } = this.state
    setChanged && this.props.setConfirm(t('You have unsaved changes, are you sure you want to leave?'))

    if (key === 'location') {
      edits['location'] = event.target.value.fullText
      edits['locationId'] = await ensureLocationIdIfCoordinate({ fetchLocation, location: edits.location, locationId: event.target.value.id })
    } else {
      edits[key] = event.target.value
    }

    this.setState({
      changed: setChanged ? true : changed,
      edits
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
      unlinkAccount,
      t
    } = this.props
    if (fetchPending || !currentUser) return <Loading />

    const { edits, changed } = this.state
    const {
      name, avatarUrl, bannerUrl, tagline, bio,
      contactEmail, contactPhone, location, url,
      facebookUrl, twitterName, linkedinUrl
    } = edits

    const locationObject = currentUser.locationObject

    return (
      <div>
        <Helmet>
          <title>{t('Your Settings')} | Hylo</title>
        </Helmet>
        <label styleName='label'>{t('Your Name')}</label>
        {!validateName(name) && <div styleName='name-validation'>{t('Name must not be blank')}</div>}
        <input type='text' styleName='name' onChange={this.updateSetting('name')} value={name || ''} />
        <label styleName='label'>{t('Banner and Avatar Images')}</label>
        <UploadAttachmentButton
          type='userBanner'
          id={currentUser.id}
          onSuccess={({ url }) => this.updateSettingDirectly('bannerUrl')(url)}
          styleName='change-banner'
        >
          <div style={bgImageStyle(bannerUrl)} styleName='banner-image'><Icon name='AddImage' styleName='uploadIcon' /></div>
        </UploadAttachmentButton>
        <UploadAttachmentButton
          type='userAvatar'
          id={currentUser.id}
          onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}
          styleName='change-avatar'
        >
          <div style={bgImageStyle(avatarUrl)} styleName='avatar-image'><Icon name='AddImage' styleName='uploadIcon' /></div>
        </UploadAttachmentButton>
        <SettingsControl label={t('Tagline')} onChange={this.updateSetting('tagline')} value={tagline} maxLength={60} />
        <SettingsControl label={t('About Me')} onChange={this.updateSetting('bio')} value={bio} type='textarea' />
        <SettingsControl
          label={t('Location')}
          onChange={this.updateSettingDirectly('location', true)}
          location={location}
          locationObject={locationObject}
          type='location'
        />
        <SettingsControl label={t('Website')} onChange={this.updateSetting('url')} value={url} />
        <SettingsControl label={t('My Skills & Interests')} renderControl={() =>
          <SkillsSection personId={currentUser.id} />} />
        <SettingsControl label={t('What I\'m learning')} renderControl={() =>
          <SkillsToLearnSection personId={currentUser.id} />} />
        <SettingsControl label={t('Contact Email')} onChange={this.updateSetting('contactEmail')} value={contactEmail} />
        <SettingsControl label={t('Contact Phone')} onChange={this.updateSetting('contactPhone')} value={contactPhone} />
        <label styleName='social-label'>{t('Social Accounts')}</label>
        <SocialControl
          label='Facebook'
          provider='facebook'
          value={facebookUrl}
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
        <div style={{ height: '80px' }} />
        <div styleName='saveChanges'>
          <span styleName={changed ? 'settingChanged' : ''}>{changed ? t('Changes not saved') : t('Current settings up to date')}</span>
          <Button label={t('Save Changes')} color={changed && validateName(name) ? 'green' : 'gray'} onClick={changed && validateName(name) ? this.save : null} styleName='save-button' />
        </div>
      </div>
    )
  }
}

export default withTranslation()(EditProfileTab)
