import PropTypes from 'prop-types'
import React, { Component } from 'react'
import cx from 'classnames'
import './CommunitySettingsTab.scss'
import Button from 'components/Button'
import ChangeImageButton from 'components/ChangeImageButton'
import SettingsControl from 'components/SettingsControl'
import SwitchStyled from 'components/SwitchStyled'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Community'
const { object, func } = PropTypes

export default class CommunitySettingsTab extends Component {
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
    if (prevProps.community !== this.props.community) {
      this.setEditState()
    }
  }

  setEditState () {
    const { community } = this.props

    if (!community) return

    const {
      name, description, location, avatarUrl, bannerUrl
    } = community

    // TODO change to inherit from community once these are in DB
    let isDiscoverable = false
    let requestSetting = 'isRequestable'
    let membersViewable = false

    this.setState({
      edits: {
        name: name || '',
        description: description || '',
        location: location || '',
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        isDiscoverable: isDiscoverable || false,
        requestSetting: requestSetting,
        membersViewable: membersViewable || false
      }
    })
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state

    if (key === 'location') {
      edits['location'] = event.target.value.fullText
      edits['locationId'] = event.target.value.id
    } else if (key === 'isDiscoverable') {
      edits[key] = !edits[key]
      if (event === true) {
        edits['requestSetting'] = ''
        edits['membersViewable'] = false
      }
    } else if (key === 'membersViewable') {
      edits[key] = !edits[key]
      if (event === false) {
        edits['isDiscoverable'] = true
        edits['requestSetting'] = 'isRequestable'
      }
    } else {
      edits[key] = event.target.value
    }

    this.setState({
      changed: setChanged ? true : changed,
      edits: { ...edits }
    })
  }

  updatePrivacySettings = (event) => {
    const { edits } = this.state

    edits['requestSetting'] = event.target.value

    this.setState({
      changed: true,
      edits: { ...edits }
    })
  }

  updateSettingDirectly = (key, changed) => value =>
    this.updateSetting(key, changed)({ target: { value } })

  save = () => {
    this.setState({ changed: false })
    this.props.updateCommunitySettings(this.state.edits)
  }

  render () {
    const { community, currentUser } = this.props
    if (!community) return <Loading />

    const { edits, changed } = this.state
    const {
      name, description, location, avatarUrl, bannerUrl, isDiscoverable, requestSetting, membersViewable
    } = edits

    const locationObject = community.locationObject || currentUser.locationObject

    return <div>
      <input type='text' styleName='name' onChange={this.updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <ChangeImageButton
          update={this.updateSettingDirectly('bannerUrl')}
          uploadSettings={{ type: 'communityBanner', id: community.id }}
          styleName='change-banner-button' />
      </div>
      <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
        <ChangeImageButton
          update={this.updateSettingDirectly('avatarUrl')}
          uploadSettings={{ type: 'communityAvatar', id: community.id }}
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
        <div styleName='control-label'>Community Privacy</div>
        <div styleName='privacy-detail'>By default, your community is not listed in the public directory.
        Only people invited to your community can join it, and only members of your community can see posts.</div>
        <div>
          <div styleName={cx('privacy-option-container', { on: isDiscoverable })}>
            <div>
              <SwitchStyled checked={isDiscoverable} onChange={this.updateSetting('isDiscoverable')} backgroundColor={isDiscoverable ? '#40A1DD' : '#808C9B'} />
              <span styleName='privacy-option'>Allow anyone to see {community.name}</span>
            </div>
            <span styleName='privacy-state'>{isDiscoverable ? 'ON' : 'OFF'}</span>
          </div>
          <div styleName='request-setting'>
            <div styleName={cx({ on: isDiscoverable })}>
              <label>
                <input type='radio' id='isRequestable' name='requestSetting' value='isRequestable' disabled={isDiscoverable === false} onChange={this.updatePrivacySettings} checked={requestSetting === 'isRequestable'} />
                <span styleName={cx('privacy-option', { disabled: !isDiscoverable })}>Anyone can request to become a member of {community.name}</span>
              </label>
            </div>
            <div styleName={cx({ on: isDiscoverable })}>
              <label>
                <input type='radio' id='isAutoJoinable' name='requestSetting' value='isAutoJoinable' disabled={isDiscoverable === false} onChange={this.updatePrivacySettings} />
                <span styleName={cx('privacy-option', { disabled: !isDiscoverable })}>Anyone can automatically join {community.name}</span>
              </label>
            </div>
            <div styleName={cx('privacy-option-container', { on: membersViewable })}>
              <div>
                <SwitchStyled checked={membersViewable} onChange={this.updateSetting('membersViewable')} backgroundColor={membersViewable ? '#40A1DD' : '#808C9B'} />
                <span styleName={cx('privacy-option', { disabled: !isDiscoverable })}>Anyone can see who is a member of {community.name}</span>
              </div>
              <span styleName='privacy-state'>{membersViewable ? 'ON' : 'OFF'}</span>
            </div>
          </div>
        </div>
      </div>
      <div styleName='button-row'>
        <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? this.save : null} styleName='save-button' />
      </div>
    </div>
  }
}

// <div styleName={cx({ on: isRequestable })}>
//   <SwitchStyled checked={isRequestable} onChange={this.updateSetting('isRequestable')} backgroundColor={isRequestable ? '#40A1DD' : '#808C9B'} />
//   <span styleName='privacy-option'>Anyone can request to become a member of {community.name}</span>
//   <span styleName='privacy-state'>{isRequestable ? 'ON' : 'OFF'}</span>
// </div>
// <div styleName={cx({ on: isAutoJoinable })}>
//   <SwitchStyled checked={isAutoJoinable} onChange={this.updateSetting('isAutoJoinable')} backgroundColor={isAutoJoinable ? '#40A1DD' : '#808C9B'} />
//   <span styleName='privacy-option'>Anyone can automatically join {community.name}</span>
//   <span styleName='privacy-state'>{isAutoJoinable ? 'ON' : 'OFF'}</span>
// </div>
