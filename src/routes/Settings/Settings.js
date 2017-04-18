import React, { PropTypes, Component } from 'react'
import './Settings.scss'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import Button from 'components/Button'
import { bgImageStyle } from 'util/index'
const { object } = PropTypes

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
    const { name, avatarUrl, bannerUrl, tagline, bio, location, email, url } = this.props.currentUser
    this.setState({
      edits: {
        name, avatarUrl, bannerUrl, tagline, bio, location, email, url
      }
    })
  }

  render () {
    const { edits, changed } = this.state
    const { name, avatarUrl, bannerUrl, tagline, bio, location, email, url } = edits

    console.log({changed})

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
      console.log('saving changes', edits)
    }

    return <div styleName='center'>
      <input styleName='name' onChange={updateSetting('name')} value={name} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner' />
      <div style={bgImageStyle(avatarUrl)} styleName='avatar' />
      <Control label='Tagline' onChange={updateSetting('tagline')} value={tagline} />
      <Control label='About Me' onChange={updateSetting('bio')} value={bio} />
      <Control label='Location' onChange={updateSetting('location')} value={location} />
      <Control label='Email' onChange={updateSetting('email')} value={email} />
      <Control label='Website' onChange={updateSetting('url')} value={url} />
      <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? save : null} />
    </div>
  }
}

export function Control ({ label, value, onChange }) {
  return <div>
    <label>{label}</label>
    <input type='text' value={value} onChange={onChange} />
  </div>
}

export function CloseButton ({ onClose }) {
  return <div styleName='close-button' onClick={onClose}>
    <Icon name='Ex' styleName='icon' />
  </div>
}
