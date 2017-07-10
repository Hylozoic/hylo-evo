import React, { PropTypes, Component } from 'react'
import './NetworkSettings.scss'
import Loading from 'components/Loading'
import Button from 'components/Button'
import ChangeImageButton from 'components/ChangeImageButton'
import ModeratorControl from 'components/ModeratorControl'
const { object, func } = PropTypes
import FullPageModal from 'routes/FullPageModal'
import { bgImageStyle } from 'util/index'
import { Control } from 'routes/UserSettings/AccountSettings/AccountSettings'
import {
  bannerUploadSettings, avatarUploadSettings, DEFAULT_BANNER, DEFAULT_AVATAR
} from 'store/models/Network'

export default class NetworkSettings extends Component {
  static propTypes = {
    network: object,
    updateNetworkSettings: func,
    fetchNetworkSettings: func
  }

  constructor (props) {
    super(props)
    this.state = {edits: {}, changed: false}
  }

  componentDidMount () {
    this.props.fetchNetworkSettings()
    this.setEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.network !== this.props.network) {
      this.props.fetchNetworkSettings()
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
    const { network, updateNetworkSettings, moderators, communities } = this.props
    if (!network) return <FullPageModal><Loading /></FullPageModal>

    const { edits, changed } = this.state
    const {
      name, description, avatarUrl, bannerUrl
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
      updateSetting(key, changed)({target: {value}})

    const save = () => {
      this.setState({changed: false})
      updateNetworkSettings(edits)
    }

    return <FullPageModal narrow>
      <div>
        <input type='text' styleName='name' onChange={updateSetting('name')} value={name || ''} />
        <div style={bgImageStyle(bannerUrl)} styleName='banner'>
          <ChangeImageButton
            update={updateSettingDirectly('bannerUrl')}
            uploadSettings={bannerUploadSettings(network)}
            styleName='change-banner-button' />
        </div>
        <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
          <ChangeImageButton
            update={updateSettingDirectly('avatarUrl')}
            uploadSettings={avatarUploadSettings(network)}
            styleName='change-avatar-button' />
        </div>
        <Control label='Description' onChange={updateSetting('description')} value={description} type='textarea' />
        <div styleName='button-row'>
          <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? save : null} styleName='save-button' />
        </div>
        <Moderators moderators={moderators} />
        <Communities communities={communities} />
      </div>
    </FullPageModal>
  }
}

export function Moderators ({ moderators }) {
  return <div styleName='moderators'>
    <div styleName='section-label'>Moderators</div>
    {moderators.map(m => <ModeratorControl moderator={m} key={m.id} />)}
  </div>
}

export function Communities ({ communities }) {
  return <div>
  </div>
}
