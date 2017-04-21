import React, { PropTypes, Component } from 'react'
import './AccountSettings.scss'
import Button from 'components/Button'
import ChangeImageButton from 'components/ChangeImageButton'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import cx from 'classnames'
import { bannerUploadSettings, avatarUploadSettings, DEFAULT_BANNER } from 'store/models/Me'
const { object, func } = PropTypes

export default class AccountSettings extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func
  }
  constructor (props) {
    super(props)
    this.state = {edits: {}, changed: false}
  }

  componentDidMount () {
    this.setEditState()
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.currentUser !== this.props.currentUser) {
      this.setEditState()
    }
  }

  setEditState () {
    const { currentUser } = this.props
    if (!currentUser) return

    const {
      name, avatarUrl, bannerUrl, tagline, bio, location, email, url, facebookUrl, twitterName, linkedInUrl
    } = currentUser

    this.setState({
      edits: {
        name,
        avatarUrl,
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        tagline,
        bio,
        location,
        email,
        url,
        facebookUrl,
        twitterName,
        linkedInUrl
      }
    })
  }

  render () {
    const { currentUser, updateUserSettings } = this.props
    if (!currentUser) return <Loading />

    const { edits, changed } = this.state
    const {
      name = '', avatarUrl, bannerUrl, tagline, bio, location, email, url, facebookUrl, twitterName, linkedInUrl
    } = edits

    const updateSetting = key => event => {
      const { edits } = this.state
      this.setState({
        changed: true,
        edits: {
          ...edits,
          [key]: event.target.value
        }
      })
    }

    const updateSettingDirectly = key => value =>
      updateSetting(key)({target: {value}})

    const save = () => {
      this.setState({changed: false})
      updateUserSettings(edits)
    }

    return <div>
      <input type='text' styleName='name' onChange={updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <ChangeImageButton
          update={updateSettingDirectly('bannerUrl')}
          uploadSettings={bannerUploadSettings(currentUser)}
          styleName='change-banner-button' />
      </div>
      <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
        <ChangeImageButton
          update={updateSettingDirectly('avatarUrl')}
          uploadSettings={avatarUploadSettings(currentUser)}
          styleName='change-avatar-button' />
      </div>
      <Control label='Tagline' onChange={updateSetting('tagline')} value={tagline} />
      <Control label='About Me' onChange={updateSetting('bio')} value={bio} type='textarea' />
      <Control label='Location' onChange={updateSetting('location')} value={location} />
      <Control label='Email' onChange={updateSetting('email')} value={email} />
      <Control label='Website' onChange={updateSetting('url')} value={url} />
      <label styleName='social-label'>Social Accounts</label>
      <SocialControl label='Facebook' onChange={updateSetting('facebookUrl')} value={facebookUrl} />
      <SocialControl label='Twitter' onChange={updateSetting('twitterName')} value={twitterName} />
      <SocialControl label='LinkedIn' onChange={updateSetting('linkedInUrl')} value={linkedInUrl} />
      <div styleName='button-row'>
        <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? save : null} styleName='save-button' />
      </div>
    </div>
  }
}

export function Control ({ label, value = '', onChange, type }) {
  return <div styleName='control'>
    <label styleName='control-label'>{label}</label>
    {type === 'textarea'
      ? <textarea styleName='control-input' value={value} onChange={onChange} />
      : <input styleName='control-input' type='text' value={value} onChange={onChange} />}
  </div>
}

export class SocialControl extends Component {
  constructor (props) {
    super(props)
    this.state = {open: false}
  }

  render () {
    const { label, onChange, value = '' } = this.props
    const { open } = this.state
    const linked = !!value
    const unlinkClicked = () => onChange({target: {value: ''}})
    const linkClicked = () => this.setState({open: true})
    const linkButton = <span
      styleName='link-button'
      onClick={linked ? unlinkClicked : linkClicked}>
      {linked ? 'Unlink' : 'Link'}
    </span>
    return <div styleName='control'>
      {open
        ? <input styleName={cx('control-input', {linked})} type='text' value={value} onChange={onChange} />
        : <div styleName={cx('social-control-label', {linked})}>{label}{linkButton}</div>}
    </div>
  }
}
