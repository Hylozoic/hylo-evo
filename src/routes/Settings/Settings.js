import React, { PropTypes, Component } from 'react'
import './Settings.scss'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import ChangeImageButton from 'components/ChangeImageButton'
import Icon from 'components/Icon'
import { bgImageStyle } from 'util/index'
const { object } = PropTypes
import cx from 'classnames'

export default class Settings extends Component {
  static propTypes = {
    currentUser: object
  }

  render () {
    const { currentUser } = this.props
    return <div styleName='modal'>
      <div styleName='content'>
        <div styleName='left-sidebar'>
          <Link to='/settings' styleName='nav-link nav-link--active'>Account</Link>
          <Link to='/settings/communities'styleName='nav-link'>Communities</Link>
        </div>
        <SettingsControls currentUser={currentUser} />
        <div styleName='right-sidebar'>
          <CloseButton onClose={() => console.log('What do we do here?')} />
        </div>
      </div>
    </div>
  }
}

export class SettingsControls extends Component {
  constructor (props) {
    super(props)
    this.state = {edits: {}, changed: false}
  }

  componentDidMount () {
    const {
      name, avatarUrl, bannerUrl, tagline, bio, location, email, url, facebookUrl, twitterName, linkedInUrl
    } = this.props.currentUser
    this.setState({
      edits: {
        name, avatarUrl, bannerUrl, tagline, bio, location, email, url, facebookUrl, twitterName, linkedInUrl
      }
    })
  }

  render () {
    const { edits, changed } = this.state
    const {
      name, avatarUrl, bannerUrl, tagline, bio, location, email, url, facebookUrl, twitterName, linkedInUrl
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

    const save = () => {
      this.setState({changed: false})
    }

    const uploadSettings = {
      id: 123456789,
      subject: 'user-avatar',
      path: `user/123456789/avatar`,
      convert: {width: 200, height: 200, fit: 'crop', rotate: 'exif'}
    }

    return <div styleName='center'>
      <ChangeImageButton update={updateSetting('avatarUrl')} uploadSettings={uploadSettings} />
      <input styleName='name' onChange={updateSetting('name')} value={name} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner' />
      <div style={bgImageStyle(avatarUrl)} styleName='avatar' />
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

export function Control ({ label, value, onChange, type }) {
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
    const { label, onChange, value } = this.props
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

export function CloseButton ({ onClose }) {
  return <div styleName='close-button' onClick={onClose}>
    <Icon name='Ex' styleName='icon' />
  </div>
}
