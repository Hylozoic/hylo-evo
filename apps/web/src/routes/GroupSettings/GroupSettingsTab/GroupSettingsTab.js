import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { set, trim } from 'lodash'
import cx from 'classnames'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import { ensureLocationIdIfCoordinate } from 'components/LocationInput/LocationInput.store'
import EditableMap from 'components/Map/EditableMap/EditableMap'
import EditableMapModal from 'components/Map/EditableMap/EditableMapModal'
import SettingsControl from 'components/SettingsControl'
import SkillsSection from 'components/SkillsSection'
import SwitchStyled from 'components/SwitchStyled'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import {
  DEFAULT_BANNER,
  DEFAULT_AVATAR,
  LOCATION_PRECISION
} from 'store/models/Group'
import { bgImageStyle } from 'util/index'
import SettingsSection from '../SettingsSection'

import general from '../GroupSettings.module.scss' // eslint-disable-line no-unused-vars
import styles from './GroupSettingsTab.module.scss' // eslint-disable-line no-unused-vars

const { object, func } = PropTypes

class GroupSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    group: object,
    fetchLocation: func,
    fetchPending: object
  }

  constructor (props) {
    super(props)
    this.state = this.defaultEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.fetchPending && !this.props.fetchPending) {
      this.setState(this.defaultEditState())
    }
  }

  defaultEditState () {
    const { group, t } = this.props

    if (!group) return { edits: {}, changed: false, valid: false }

    const {
      aboutVideoUri, avatarUrl, bannerUrl, description, geoShape, location, locationObject, name, settings
    } = group

    return {
      edits: {
        aboutVideoUri: (aboutVideoUri && trim(aboutVideoUri)) || '',
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        description: description || '',
        geoShape: geoShape && typeof geoShape !== 'string' ? JSON.stringify(geoShape) || '' : geoShape || '',
        location: location || '',
        locationId: locationObject ? locationObject.id : '',
        stewardDescriptor: group.stewardDescriptor || t('Moderator'),
        stewardDescriptorPlural: group.stewardDescriptorPlural || t('Moderators'),
        name: name || '',
        purpose: group.purpose || '',
        settings: typeof settings !== 'undefined' ? settings : { }
      },
      error: null,
      changed: false,
      isModal: false,
      postTypesModalOpen: false
    }
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state

    if (key === 'location') {
      edits['location'] = event.target.value.fullText
      edits['locationId'] = event.target.value.id
    } else {
      set(edits, key, event.target.value)
    }

    this.setState({
      changed: setChanged ? true : changed,
      edits: { ...edits }
    })
  }

  updateSettingDirectly = (key, changed) => value =>
    this.updateSetting(key, changed)({ target: { value } })

  savePolygon = (polygon) => {
    const { edits } = this.state
    this.setState({
      changed: true,
      edits: { ...edits, geoShape: polygon ? JSON.stringify(polygon.geometry) : null }
    })
  }

  toggleModal = () => {
    this.setState({
      isModal: !this.state.isModal
    })
  }

  save = async () => {
    this.setState({ changed: false })
    const { group, fetchLocation } = this.props
    let locationId = this.state.edits.locationId
    if (group && this.state.edits.location !== group.location) {
      locationId = await ensureLocationIdIfCoordinate({ fetchLocation, location: this.state.edits.location, locationId })
    }
    this.props.updateGroupSettings({ ...this.state.edits, locationId })
  }

  saveButtonContent () {
    const { changed, error } = this.state
    if (!changed) return { color: 'gray', style: '', text: this.props.t('Current settings up to date') }
    if (error) {
      return { color: 'purple', style: 'general.settingIncorrect', text: error }
    }
    return { color: 'green', style: 'general.settingChanged', text: this.props.t('Changes not saved') }
  }

  render () {
    const { currentUser, group, t } = this.props
    if (!group) return <Loading />

    const { changed, edits, error } = this.state
    const {
      aboutVideoUri, avatarUrl, bannerUrl, description, geoShape, location, stewardDescriptor, stewardDescriptorPlural, name, purpose, settings
    } = edits

    const { locationDisplayPrecision, showSuggestedSkills } = settings
    const editableMapLocation = group?.locationObject || currentUser.locationObject

    t('Display exact location')
    t('Display only nearest city and show nearby location on the map')
    t('Display only nearest city and dont show on the map')

    return (
      <div className={general.groupSettings}>
        <span className={styles.nameBox}>
          <label className={styles.label}>{t('Group Name')}</label>
          <input type='text' className={styles.name} onChange={this.updateSetting('name')} value={name || ''} />
        </span>
        <label className={styles.label}>{t('Banner and Avatar Images')}</label>
        <UploadAttachmentButton
          type='groupBanner'
          id={group.id}
          onSuccess={({ url }) => this.updateSettingDirectly('bannerUrl')(url)}
          className={styles.changeBanner}
        >
          <div style={bgImageStyle(bannerUrl)} className={styles.bannerImage}>
            <Icon name='AddImage' className={styles.uploadIcon} />
          </div>
        </UploadAttachmentButton>
        <UploadAttachmentButton
          type='groupAvatar'
          id={group.id}
          onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}
          className={styles.changeAvatar}
        >
          <div style={bgImageStyle(avatarUrl)} className={styles.avatarImage}>
            <Icon name='AddImage' className={styles.uploadIcon} />
          </div>
        </UploadAttachmentButton>
        <SettingsControl
          helpText={t('purposeHelpText')}
          label={t('Purpose Statement')}
          maxLength='500'
          onChange={this.updateSetting('purpose')}
          type='textarea'
          value={purpose}
        />
        <SettingsControl label={t('Description')} onChange={this.updateSetting('description')} value={description} type='textarea' />
        <SettingsControl label={t('About Video URL')} onChange={this.updateSetting('aboutVideoUri')} value={aboutVideoUri} />
        <SettingsControl
          label={t('Location')}
          onChange={this.updateSettingDirectly('location', true)}
          location={location}
          locationObject={group.locationObject}
          type='location'
        />
        <label className={styles.label}>{t('Location Privacy:')}</label>
        <Dropdown
          className={styles.locationObfuscationDropdown}
          toggleChildren={<span className={styles.locationObfuscationDropdownLabel}>
            {LOCATION_PRECISION[locationDisplayPrecision || 'precise']}
            <Icon name='ArrowDown' />
          </span>}
          items={Object.keys(LOCATION_PRECISION).map(value => ({
            label: t(LOCATION_PRECISION[value]),
            onClick: () => this.updateSettingDirectly('settings.locationDisplayPrecision')(value)
          }))}
        />
        <p className={general.detailText}>{t('Note: with Administration rights you will always see the exact location displayed')}</p>
        <br />

        <SettingsControl
          label={t('Word used to describe a group Steward')}
          onChange={this.updateSetting('stewardDescriptor')}
          value={stewardDescriptor}
        />

        <SettingsControl
          label={t('Plural word used to describe group Stewards')}
          onChange={this.updateSetting('stewardDescriptorPlural')}
          value={stewardDescriptorPlural}
        />

        <br />

        <SettingsSection>
          <h3>{t('Relevant skills & interests')}</h3>
          <p className={general.detailText}>{t('What skills and interests are particularly relevant to this group?')}</p>
          <div className={cx(styles.skillsSetting, { [general.on]: showSuggestedSkills })}>
            <div className={general.switchContainer}>
              <SwitchStyled
                checked={showSuggestedSkills}
                onChange={() => this.updateSettingDirectly('settings.showSuggestedSkills')(!showSuggestedSkills)}
                backgroundColor={showSuggestedSkills ? '#0DC39F' : '#8B96A4'} />
              <span className={general.toggleDescription}>{t('Ask new members whether they have these skills and interests?')}</span>
              <div className={general.onOff}>
                <div className={general.off}>{t('OFF')}</div>
                <div className={general.on}>{t('ON')}</div>
              </div>
            </div>
          </div>
          <SkillsSection
            group={group}
            label={t('Add a relevant skill or interest')}
            placeholder={t('What skills and interests are most relevant to your group?')} />
        </SettingsSection>

        <br />

        <SettingsControl
          label={t('What area does your group cover?')}
          onChange={this.updateSetting('geoShape')}
          placeholder={t('For place based groups, draw the area where your group is active (or paste in GeoJSON here)')}
          type='text'
          value={geoShape || ''}
        />
        <div className={styles.editableMapContainer}>
          { this.state.isModal
            ? <EditableMapModal group={group} toggleModal={this.toggleModal}>
              <EditableMap
                locationObject={editableMapLocation}
                polygon={geoShape}
                savePolygon={this.savePolygon}
                toggleModal={this.toggleModal}
              />
            </EditableMapModal>
            : <EditableMap
              locationObject={editableMapLocation}
              polygon={geoShape}
              savePolygon={this.savePolygon}
              toggleModal={this.toggleModal}
            /> }
        </div>
        <br />

        <div className={general.saveChanges}>
          <span className={this.saveButtonContent().style}>{this.saveButtonContent().text}</span>
          <Button label={t('Save Changes')} color={this.saveButtonContent().color} onClick={changed && !error ? this.save : null} className={cx('saveButton', general.saveButton)} />
        </div>
      </div>
    )
  }
}
export default withTranslation()(GroupSettingsTab)
