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
      name, description, locationText, avatarUrl, bannerUrl
    } = community

    this.setState({
      edits: {
        name: name || '',
        description: description || '',
        locationText: locationText || '',
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER
      }
    })
  }

  render () {
    const { community, updateCommunitySettings } = this.props
    if (!community) return <Loading />

    const { edits, changed } = this.state
    const {
      name, description, locationText, avatarUrl, bannerUrl
    } = edits

    const updateSetting = (key, setChanged = true) => event => {
      const { edits, changed } = this.state
      this.setState({
        changed: setChanged ? true : changed,
        edits: {
          ...edits,
          [key]: event.target.value
        }
      })
    }

    const updateSettingDirectly = (key, changed) => value =>
      updateSetting(key, changed)({ target: { value } })

    const save = () => {
      this.setState({ changed: false })
      updateCommunitySettings(edits)
    }

    return <div>
      <input type='text' styleName='name' onChange={updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <ChangeImageButton
          update={updateSettingDirectly('bannerUrl')}
          uploadSettings={{ type: 'communityBanner', id: community.id }}
          styleName='change-banner-button' />
      </div>
      <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
        <ChangeImageButton
          update={updateSettingDirectly('avatarUrl')}
          uploadSettings={{ type: 'communityAvatar', id: community.id }}
          styleName='change-avatar-button' />
      </div>
      <SettingsControl label='Description' onChange={updateSetting('description')} value={description} type='textarea' />
      <SettingsControl label='Location' onChange={updateSetting('locationText')} value={locationText} type='location' />
      <div styleName='button-row'>
        <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? save : null} styleName='save-button' />
      </div>
    </div>
  }
}
