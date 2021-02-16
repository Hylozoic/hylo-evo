import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cx from 'classnames'
import './GroupSettingsTab.scss'
import Button from 'components/Button'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import SettingsControl from 'components/SettingsControl'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER, DEFAULT_AVATAR, GROUP_ACCESSIBILITY, GROUP_VISIBILITY } from 'store/models/Group'
const { object } = PropTypes

export default class GroupSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    group: object
  }
  constructor (props) {
    super(props)
    this.state = { edits: {}, changed: false }
  }

  componentDidMount () {
    this.setEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.group !== this.props.group) {
      this.setEditState()
    }
  }

  setEditState () {
    const { group } = this.props

    if (!group) return

    const {
      accessibility, avatarUrl, bannerUrl, description, location, name, settings, visibility
    } = group

    this.setState({
      edits: {
        accessibility: accessibility || GROUP_ACCESSIBILITY.Restricted,
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        description: description || '',
        location: location || '',
        name: name || '',
        settings: settings || { allowGroupInvites: false, publicMemberDirectory: false },
        visibility: visibility || GROUP_VISIBILITY.Protected
      }
    })
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state

    if (key === 'location') {
      edits['location'] = event.target.value.fullText
      edits['locationId'] = event.target.value.id
    } else if (key === 'accessibility' || key === 'visibility') {
      edits[key] = parseInt(event.target.value)
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
    this.props.updateGroupSettings(this.state.edits)
  }

  render () {
    const { group, currentUser } = this.props
    if (!group) return <Loading />

    const { edits, changed } = this.state
    const {
      accessibility, avatarUrl, bannerUrl, description, location, name, visibility
    } = edits

    const locationObject = group.locationObject || currentUser.locationObject

    return <div styleName='groupSettings'>
      <input type='text' styleName='name' onChange={this.updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <UploadAttachmentButton
          type='groupBanner'
          id={group.id}
          onSuccess={({ url }) => this.updateSettingDirectly('bannerUrl')(url)}
          styleName='change-banner-button' />
      </div>
      <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
        <UploadAttachmentButton
          type='groupAvatar'
          id={group.id}
          onSuccess={({ url }) => this.updateSettingDirectly('avatarUrl')(url)}
          styleName='change-avatar-button' />
      </div>
      <SettingsControl label='Description' onChange={this.updateSetting('description')} value={description} type='textarea' />
      <SettingsControl
        label='Location'
        onChange={this.updateSettingDirectly('location', true)}
        location={location}
        locationObject={locationObject}
        type='location'
      />
      <div styleName='privacy-settings'>
        {/* <div styleName={cx('privacy-option-container', { on: isPublic })}>
          <div>
            <SwitchStyled checked={isPublic} onChange={this.updateSetting('isPublic')} backgroundColor={isPublic ? '#40A1DD' : '#808C9B'} />
            <span styleName='privacy-option'>Allow anyone to see {group.name}</span>
          </div>
          <span styleName='privacy-state'>{isPublic ? 'ON' : 'OFF'}</span>
        </div> */}
        <div styleName='groupPrivacySection'>
          <h3>Visibility</h3>
          <p styleName='privacy-detail'>Who is able to see {group.name}?</p>
          <div styleName={cx({ on: visibility === GROUP_VISIBILITY.Public })}>
            <label>
              <input type='radio' name='visibility' value={GROUP_VISIBILITY.Public} onChange={this.updateSetting('visibility')} checked={visibility === GROUP_VISIBILITY.Public} />
              <span styleName={cx('privacy-option', { disabled: visibility !== GROUP_VISIBILITY.Public })}>Anyone can find and see {group.name}</span>
            </label>
          </div>
          <div styleName={cx({ on: visibility === GROUP_VISIBILITY.Protected })}>
            <label>
              <input type='radio' name='visibility' value={GROUP_VISIBILITY.Protected} onChange={this.updateSetting('visibility')} checked={visibility === GROUP_VISIBILITY.Protected} />
              <span styleName={cx('privacy-option', { disabled: visibility !== GROUP_VISIBILITY.Protected })}>Only members of parent groups can see {group.name}</span>
            </label>
          </div>
          <div styleName={cx({ on: visibility === GROUP_VISIBILITY.Hidden })}>
            <label>
              <input type='radio' name='visibility' value={GROUP_VISIBILITY.Hidden} onChange={this.updateSetting('visibility')} checked={visibility === GROUP_VISIBILITY.Hidden} />
              <span styleName={cx('privacy-option', { disabled: visibility !== GROUP_VISIBILITY.Hidden })}>Only members of {group.name} can see this group</span>
            </label>
          </div>
        </div>

        <div styleName='groupPrivacySection'>
          <h3>Access</h3>
          <p styleName='privacy-detail'>How can people become members of {group.name}</p>
          <div styleName={cx({ on: accessibility === GROUP_ACCESSIBILITY.Open })}>
            <label>
              <input type='radio' name='accessibility' value={GROUP_ACCESSIBILITY.Open} onChange={this.updateSetting('accessibility')} checked={accessibility === GROUP_ACCESSIBILITY.Open} />
              <span styleName={cx('privacy-option', { disabled: accessibility !== GROUP_ACCESSIBILITY.Open })}>Anyone who can see {group.name} can automatically join it</span>
            </label>
          </div>
          <div styleName={cx({ on: accessibility === GROUP_ACCESSIBILITY.Restricted })}>
            <label>
              <input type='radio' name='accessibility' value={GROUP_ACCESSIBILITY.Restricted} onChange={this.updateSetting('accessibility')} checked={accessibility === GROUP_ACCESSIBILITY.Restricted} />
              <span styleName={cx('privacy-option', { disabled: accessibility !== GROUP_ACCESSIBILITY.Restricted })}>Anyone can apply to join but must be approved by a moderator</span>
            </label>
          </div>
          <div styleName={cx({ on: accessibility === GROUP_ACCESSIBILITY.Closed })}>
            <label>
              <input type='radio' name='accessibility' value={GROUP_ACCESSIBILITY.Closed} onChange={this.updateSetting('accessibility')} checked={accessibility === GROUP_ACCESSIBILITY.Closed} />
              <span styleName={cx('privacy-option', { disabled: accessibility !== GROUP_ACCESSIBILITY.Closed })}>Membership in {group.name} is invite only</span>
            </label>
          </div>
        </div>
      </div>

      <div styleName='button-row'>
        <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? this.save : null} styleName='save-button' />
      </div>
    </div>
  }
}
