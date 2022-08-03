import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { set, trim, isEqual } from 'lodash'
import cx from 'classnames'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
import EditableMap from 'components/Map/EditableMap/EditableMap'
import Icon from 'components/Icon'
import { ensureLocationIdIfCoordinate } from 'components/LocationInput/LocationInput.store'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import SettingsControl from 'components/SettingsControl'
import SkillsSection from 'components/SkillsSection'
import SwitchStyled from 'components/SwitchStyled'
import Loading from 'components/Loading'
import {
  DEFAULT_BANNER,
  DEFAULT_AVATAR,
  LOCATION_PRECISION
} from 'store/models/Group'
import { bgImageStyle } from 'util/index'
import SettingsSection from '../SettingsSection'

import general from '../GroupSettings.scss' // eslint-disable-line no-unused-vars
import styles from './GroupSettingsTab.scss' // eslint-disable-line no-unused-vars
import EditableMapModal from 'components/Map/EditableMap/EditableMapModal'
import { sanitizeURL } from 'util/url'
import { CUSTOM_VIEW_MODES } from 'store/constants'
import { POST_TYPES } from 'store/models/Post'

const emptyCustomView = {
  name: '',
  icon: '',
  postTypes: [],
  activePostsOnly: false,
  externalLink: '',
  viewMode: '',
  isActive: true,
  order: 1
}

const validCustomView = ({ name, icon, postTypes, activePostsOnly, externalLink, viewMode, isActive }) => {
  let errorString = 'Incomplete custom view: \n'
  let valid = true
  if (externalLink.length > 0) {
    if (!sanitizeURL(externalLink)) {
      valid = false
      errorString += 'The external link has to be a valid URL. \n'
    }
  }

  if (name.length < 2) {
    valid = false
    errorString += 'Name needs to be at least two characters long. \n'
  }
  if (icon.length < 1) {
    valid = false
    errorString += 'An icon needs to be selected. '
  }

  return { valid, errorString }
}

const { object, func } = PropTypes

export default class GroupSettingsTab extends Component {
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
    const { group } = this.props

    if (!group) return { edits: {}, changed: false }

    const {
      aboutVideoUri, avatarUrl, bannerUrl, customViews, description, geoShape, location, locationObject, name, settings
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
        moderatorDescriptor: group.moderatorDescriptor || 'Moderator',
        moderatorDescriptorPlural: group.moderatorDescriptorPlural || 'Moderators',
        name: name || '',
        settings: typeof settings !== 'undefined' ? settings : { },
        customViews: customViews.items[0] ? customViews.items : [emptyCustomView]
      },
      changed: false,
      isModal: false
    }
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state

    if (key === 'location') {
      edits['location'] = event.target.value.fullText
      edits['locationId'] = event.target.value.id
    } else {
      if (key.includes('customview.')) {
        const modKey = key.slice(11)
        set(edits.customViews[0], modKey, event.target.value)
      } else {
        set(edits, key, event.target.value)
      }
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

  renderCustomViewUI = () => {
    const { name, icon, externalLink, postTypes, viewMode, activePostsOnly, isActive } = this.state.edits.customViews[0]

    let postTypeOptions = Object.keys(POST_TYPES).map(value => ({
      label: POST_TYPES[value].label,
      onClick: () => this.updateSettingDirectly('customview.postTypes')([value])
    }))
      .concat([{ label: 'No filter', onClick: () => this.updateSettingDirectly('customview.postTypes')([]) }])
    return (
      <div styleName='styles.custom-view-container'>
        {icon ? <Icon green name={icon} /> : null}<SettingsControl label='Custom View Label' onChange={this.updateSetting('customview.name')} value={name} />
        <SettingsControl label='Select Icon' onChange={(value) => this.updateSettingDirectly('customview.icon')(value)} value={icon} type='icon-selector' />
        <SettingsControl label='External link' onChange={this.updateSetting('customview.externalLink')} value={sanitizeURL(externalLink)} />
        <div styleName='styles.help-text'>You can point to an external URL, OR display a customized view of your group's posts</div>
        {externalLink && !sanitizeURL(externalLink) && <div styleName='styles.warning'>Must be a valid URL!</div>}
        <h5> Custom Internal View</h5>
        <label styleName='styles.label'>View Style</label>
        <Dropdown
          styleName='styles.location-obfuscation-dropdown'
          toggleChildren={
            <span styleName='styles.location-obfuscation-dropdown-label'>
              {CUSTOM_VIEW_MODES[viewMode || 'stream']}
              <Icon name='ArrowDown' />
            </span>
            }
          items={Object.keys(CUSTOM_VIEW_MODES).map(value => ({
            label: CUSTOM_VIEW_MODES[value],
            onClick: () => this.updateSettingDirectly('customview.viewMode')(value)
          }))}
        />
        <div style={{ paddingTop: '4px', paddingBottom: '4px' }}>
          <label styleName='styles.label'>Post Types</label>
          <Dropdown
            styleName='styles.location-obfuscation-dropdown'
            toggleChildren={
              <span styleName='styles.location-obfuscation-dropdown-label'>
                {POST_TYPES[postTypes[0]]?.label || 'No filter'}
                <Icon name='ArrowDown' />
              </span>
              }
            items={postTypeOptions}
          />
        </div>
        <div style={{ paddingTop: '4px' }} styleName='general.switchContainer'>
          <SwitchStyled
            checked={activePostsOnly}
            onChange={() => this.updateSettingDirectly('customview.activePostsOnly')(!activePostsOnly)}
            backgroundColor={activePostsOnly ? '#0DC39F' : '#8B96A4'}
          />
          <span styleName='general.toggleDescription'>Include only active posts?</span>
        </div>
        {(!isEqual(this.state.edits.customViews[0], emptyCustomView)) &&
          <div style={{ paddingTop: '4px' }} styleName='general.switchContainer'>
            <SwitchStyled
              checked={isActive}
              onChange={() => this.updateSettingDirectly('customview.isActive')(!isActive)}
              backgroundColor={isActive ? '#0DC39F' : '#8B96A4'}
            />
            <span styleName='general.toggleDescription'>Keep this custom view active?</span>
          </div>}
      </div>
    )
  }

  saveButtonContent () {
    const { changed, edits } = this.state
    if (!changed) return { color: 'gray', style: '', text: 'Current settings up to date' }
    if (isEqual(edits.customViews[0], emptyCustomView)) return { color: 'green', style: 'general.settingChanged', text: 'Changes not saved' }
    if (validCustomView(edits.customViews[0]).valid) return { color: 'green', style: 'general.settingChanged', text: 'Changes not saved' }
    return { color: 'purple', style: 'general.settingIncorrect', text: validCustomView(edits.customViews[0]).errorString }
  }

  render () {
    const { currentUser, group } = this.props
    if (!group) return <Loading />

    const { edits, changed } = this.state
    const {
      aboutVideoUri, avatarUrl, bannerUrl, description, geoShape, location, moderatorDescriptor, moderatorDescriptorPlural, name, settings
    } = edits

    const { locationDisplayPrecision, showSuggestedSkills } = settings
    const editableMapLocation = group?.locationObject || currentUser.locationObject

    return (
      <div styleName='general.groupSettings'>
        <input type='text' styleName='styles.name' onChange={this.updateSetting('name')} value={name || ''} />
        <div style={bgImageStyle(bannerUrl)} styleName='styles.banner'>
          <UploadAttachmentButton
            type='groupBanner'
            id={group.id}
            onSuccess={({ url }) => this.updateSettingDirectly('bannerUrl')(url)}
            styleName='styles.change-banner-button'
          />
        </div>
        <div style={bgImageStyle(avatarUrl)} styleName='styles.avatar'>
          <UploadAttachmentButton
            type='groupAvatar'
            id={group.id}
            onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}
            styleName='styles.change-avatar-button'
          />
        </div>
        <SettingsControl label='Description' onChange={this.updateSetting('description')} value={description} type='textarea' />
        <SettingsControl label='About Video URL' onChange={this.updateSetting('aboutVideoUri')} value={aboutVideoUri} />
        <SettingsControl
          label='Location'
          onChange={this.updateSettingDirectly('location', true)}
          location={location}
          locationObject={group.locationObject}
          type='location'
        />
        <label styleName='styles.label'>Location Privacy:</label>
        <Dropdown
          styleName='styles.location-obfuscation-dropdown'
          toggleChildren={<span styleName='styles.location-obfuscation-dropdown-label'>
            {LOCATION_PRECISION[locationDisplayPrecision || 'precise']}
            <Icon name='ArrowDown' />
          </span>}

          items={Object.keys(LOCATION_PRECISION).map(value => ({
            label: LOCATION_PRECISION[value],
            onClick: () => this.updateSettingDirectly('settings.locationDisplayPrecision')(value)
          }))}
        />
        <p styleName='general.detailText'>Note: as a moderator you will always see the exact location displayed</p>

        <br />

        <SettingsControl
          label='Word used to describe a group Moderator'
          onChange={this.updateSetting('moderatorDescriptor')}
          value={moderatorDescriptor}
        />

        <SettingsControl
          label='Plural word used to describe group Moderators'
          onChange={this.updateSetting('moderatorDescriptorPlural')}
          value={moderatorDescriptorPlural}
        />

        <br />

        <SettingsSection>
          <h3>Relevant skills &amp; interests</h3>
          <p styleName='general.detailText'>What skills and interests are particularly relevant to this group?</p>
          <div styleName={'styles.skillsSetting' + ' ' + cx({ 'general.on': showSuggestedSkills })}>
            <div styleName='general.switchContainer'>
              <SwitchStyled
                checked={showSuggestedSkills}
                onChange={() => this.updateSettingDirectly('settings.showSuggestedSkills')(!showSuggestedSkills)}
                backgroundColor={showSuggestedSkills ? '#0DC39F' : '#8B96A4'} />
              <span styleName='general.toggleDescription'>Ask new members whether they have these skills and interests?</span>
              <div styleName='general.onOff'>
                <div styleName='general.off'>OFF</div>
                <div styleName='general.on'>ON</div>
              </div>
            </div>
          </div>
          <SkillsSection
            group={group}
            label='Add a relevant skill or interest'
            placeholder='What skills and interests are most relevant to your group?' />
        </SettingsSection>
        <SettingsSection>
          <h3>Custom View</h3>
          <div styleName='styles.help-text'>Add a custom link orview to your group's navigation</div>
          {this.renderCustomViewUI()}
        </SettingsSection>

        <br />

        <SettingsControl
          label='What area does your group cover?'
          onChange={this.updateSetting('geoShape')}
          placeholder='For place based groups, draw the area where your group is active (or paste in GeoJSON here)'
          type='text'
          value={geoShape || ''}
        />
        <div styleName='styles.editable-map-container'>
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

        <div styleName='general.saveChanges'>
          <span styleName={this.saveButtonContent().style}>{this.saveButtonContent().text}</span>
          <Button label='Save Changes' color={this.saveButtonContent().color} onClick={changed && validCustomView(this.state.edits.customViews[0]).valid ? this.save : null} styleName='general.save-button' />
        </div>
      </div>
    )
  }
}
