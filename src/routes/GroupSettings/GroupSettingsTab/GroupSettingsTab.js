import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { set, trim } from 'lodash'
import cx from 'classnames'
import Button from 'components/Button'
import Dropdown from 'components/Dropdown'
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
      aboutVideoUri, avatarUrl, bannerUrl, description, location, locationObject, name, settings
    } = group

    return {
      edits: {
        aboutVideoUri: aboutVideoUri && trim(aboutVideoUri),
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        description: description || '',
        location: location || '',
        locationId: locationObject ? locationObject.id : '',
        name: name || '',
        settings: typeof settings !== 'undefined' ? settings : { }
      },
      changed: false
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

  save = async () => {
    this.setState({ changed: false })
    const { group, fetchLocation } = this.props
    let locationId = this.state.edits.locationId
    if (group && this.state.edits.location !== group.location) {
      locationId = await ensureLocationIdIfCoordinate({ fetchLocation, location: this.state.edits.location, locationId })
    }

    this.props.updateGroupSettings({ ...this.state.edits, locationId })
  }

  render () {
    const { currentUser, group } = this.props
    if (!group) return <Loading />

    const { edits, changed } = this.state
    const {
      aboutVideoUri, avatarUrl, bannerUrl, description, location, name, settings
    } = edits

    const { locationDisplayPrecision, showSuggestedSkills } = settings

    const locationObject = group.locationObject || currentUser.locationObject

    return (
      <div styleName='general.groupSettings'>
        <input type='text' styleName='styles.name' onChange={this.updateSetting('name')} value={name || ''} />
        <div style={bgImageStyle(bannerUrl)} styleName='styles.banner'>
          <UploadAttachmentButton
            type='groupBanner'
            id={group.id}
            onSuccess={({ url }) => this.updateSettingDirectly('bannerUrl')(url)}
            styleName='styles.change-banner-button' />
        </div>
        <div style={bgImageStyle(avatarUrl)} styleName='styles.avatar'>
          <UploadAttachmentButton
            type='groupAvatar'
            id={group.id}
            onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}
            styleName='styles.change-avatar-button' />
        </div>
        <SettingsControl label='Description' onChange={this.updateSetting('description')} value={description} type='textarea' />
        <SettingsControl label='About Video URL' onChange={this.updateSetting('aboutVideoUri')} value={aboutVideoUri} />
        <SettingsControl
          label='Location'
          onChange={this.updateSettingDirectly('location', true)}
          location={location}
          locationObject={locationObject}
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
        <br />
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

        <div styleName='general.saveChanges'>
          <span styleName={changed ? 'general.settingChanged' : ''}>{changed ? 'Changes not saved' : 'Current settings up to date'}</span>
          <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? this.save : null} styleName='general.save-button' />
        </div>
      </div>
    )
  }
}
