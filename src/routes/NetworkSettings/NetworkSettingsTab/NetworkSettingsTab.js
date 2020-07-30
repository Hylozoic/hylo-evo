import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bgImageStyle } from 'util/index'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import SettingsControl from 'components/SettingsControl'
import '../NetworkSettings.scss'
import Button from 'components/Button'
import { DEFAULT_BANNER, DEFAULT_AVATAR } from 'store/models/Network'
import Loading from 'components/Loading'

const { func, object } = PropTypes

export default class NetworkSettingsTab extends Component {
  constructor (props) {
    super(props)
    this.state = { edits: {}, changed: false, saved: false }
  }

  static propTypes = {
    network: object,
    setConfirm: func.isRequired,
    updateNetworkSettings: func.isRequired
  }

  state = {
    changed: false,
    saved: false,
    edits: {}
  }

  componentDidMount () {
    this.setEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.network !== this.props.network) {
      this.setEditState()
    }
  }

  setEditState () {
    const { network } = this.props

    if (!network) return

    const {
      name, description, avatarUrl, bannerUrl
    } = network

    this.setState({
      edits: {
        name: name || '',
        description: description || '',
        avatarUrl: avatarUrl || DEFAULT_AVATAR,
        bannerUrl: bannerUrl || DEFAULT_BANNER
      }
    })
  }

  render () {
    const {
      network,
      setConfirm,
      updateNetworkSettings
    } = this.props

    if (!network) return <Loading />

    const { edits, changed, saved } = this.state
    const {
      name, description, avatarUrl, bannerUrl
    } = edits

    const updateSetting = (key, setChanged = true) => event => {
      const { edits, changed } = this.state
      setChanged && setConfirm('You have unsaved changes, are you sure you want to leave?')
      this.setState({
        saved: false,
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
      this.setState({ saved: true })
      setConfirm(false)
      updateNetworkSettings(edits)
    }

    return <div>
      <input type='text' styleName='name' onChange={updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <UploadAttachmentButton
          id={network.id}
          type='networkBanner'
          attachmentType='image'
          update={updateSettingDirectly('bannerUrl')}
          styleName='change-banner-button' />
      </div>
      <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
        <UploadAttachmentButton
          id={network.id}
          type='networkAvatar'
          attachmentType='image'
          update={updateSettingDirectly('avatarUrl')}
          styleName='change-avatar-button' />
      </div>
      <SettingsControl label='Description' onChange={updateSetting('description')} value={description} type='textarea' />
      <div styleName='button-row'>
        <Button label={saved ? 'Saved' : 'Save Changes'} color={changed ? 'green' : 'gray'} onClick={changed ? save : null} styleName='button' />
      </div>
    </div>
  }
}
