import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './CommunitySettingsTab.scss'
import Button from 'components/Button'
import ChangeImageButton from 'components/ChangeImageButton'
import SettingsControl from 'components/SettingsControl'
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

    this.setState({
      edits: {
        name: name || '',
        description: description || '',
        location: location || '',
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER
      }
    })
  }

  updateSetting = (key, setChanged = true) => event => {
    const { edits, changed } = this.state

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
    this.props.updateCommunitySettings(this.state.edits)
  }

  render () {
    const { community, currentUser } = this.props
    if (!community) return <Loading />

    const { edits, changed } = this.state
    const {
      name, description, location, avatarUrl, bannerUrl
    } = edits

    const locationObject = community.locationObject || currentUser.locationObject

    return <div>
      <input type='text' styleName='name' onChange={this.updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <ChangeImageButton
          id={community.id}
          type='communityBanner'
          attachmentType='image'
          update={this.updateSettingDirectly('bannerUrl')}
          styleName='change-banner-button' />
      </div>
      <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
        <ChangeImageButton
          id={community.id}
          type='communityAvatar'
          attachmentType='image'
          update={this.updateSettingDirectly('avatarUrl')}
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
      <div styleName='button-row'>
        <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? this.save : null} styleName='save-button' />
      </div>
    </div>
  }
}
