import React, { PropTypes, Component } from 'react'
import SettingsControl from 'components/SettingsControl'
import './AccountSettingsTab.scss'
import Button from 'components/Button'
import ChangeImageButton from 'components/ChangeImageButton'
import Loading from 'components/Loading'
import { bgImageStyle } from 'util/index'
import cx from 'classnames'
import { DEFAULT_BANNER } from 'store/models/Me'
const { object, func } = PropTypes

const twitterPrompt = () => window.prompt('Please enter your twitter name.')

export default class AccountSettingsTab extends Component {
  static propTypes = {
    currentUser: object,
    updateUserSettings: func,
    loginWithService: func
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
        name: name || '',
        avatarUrl: avatarUrl || '',
        bannerUrl: bannerUrl || DEFAULT_BANNER,
        tagline: tagline || '',
        bio: bio || '',
        location: location || '',
        email: email || '',
        url: url || '',
        facebookUrl,
        twitterName,
        linkedInUrl
      }
    })
  }

  render () {
    const {
      currentUser,
      updateUserSettings,
      loginWithService,
      unlinkAccount,
      setConfirm
     } = this.props
    if (!currentUser) return <Loading />

    const { edits, changed } = this.state
    const {
      name, avatarUrl, bannerUrl, tagline, bio, location, email, url, facebookUrl, twitterName, linkedInUrl
    } = edits

    const updateSetting = (key, setChanged = true) => event => {
      const { edits, changed } = this.state
      setChanged && setConfirm('You have unsaved changes, are you sure you want to leave?')
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
      setConfirm(false)
      updateUserSettings(edits)
    }

    return <div>
      <input type='text' styleName='name' onChange={updateSetting('name')} value={name || ''} />
      <div style={bgImageStyle(bannerUrl)} styleName='banner'>
        <ChangeImageButton
          update={updateSettingDirectly('bannerUrl')}
          uploadSettings={{type: 'userBanner', id: currentUser.id}}
          styleName='change-banner-button' />
      </div>
      <div style={bgImageStyle(avatarUrl)} styleName='avatar'>
        <ChangeImageButton
          update={updateSettingDirectly('avatarUrl')}
          uploadSettings={{type: 'userAvatar', id: currentUser.id}}
          styleName='change-avatar-button' />
      </div>
      <SettingsControl label='Tagline' onChange={updateSetting('tagline')} value={tagline} maxLength={60} />
      <SettingsControl label='About Me' onChange={updateSetting('bio')} value={bio} type='textarea' />
      <SettingsControl label='Location' onChange={updateSetting('location')} value={location} />
      <SettingsControl label='Email' onChange={updateSetting('email')} value={email} />
      <SettingsControl label='Website' onChange={updateSetting('url')} value={url} />
      <label styleName='social-label'>Social Accounts</label>
      <SocialControl
        label='Facebook'
        onLink={() => loginWithService('facebook')}
        onChange={updateSettingDirectly('facebookUrl', false)}
        unlinkAccount={unlinkAccount}
        provider='facebook'
        value={facebookUrl} />
      <SocialControl
        label='Twitter'
        onLink={() => twitterPrompt()}
        onChange={updateSettingDirectly('twitterName', false)}
        unlinkAccount={unlinkAccount}
        provider='twitter'
        value={twitterName}
        updateUserSettings={updateUserSettings} />
      <SocialControl
        label='LinkedIn'
        onLink={() => loginWithService('linkedin')}
        unlinkAccount={unlinkAccount}
        onChange={updateSettingDirectly('linkedInUrl', false)}
        provider='linkedin'
        value={linkedInUrl} />
      <div styleName='button-row'>
        <Button label='Save Changes' color={changed ? 'green' : 'gray'} onClick={changed ? save : null} styleName='save-button' />
      </div>
    </div>
  }
}

export const socialLinkClicked = provider => {}

export class SocialControl extends Component {
  linkClicked () {
    const { provider, onLink, updateUserSettings, onChange } = this.props

    if (provider === 'twitter') {
      const twitterName = onLink()
      if (twitterName === null) return onChange(false)
      updateUserSettings({twitterName})
      return onChange(true)
    } else {
      return onLink()
      .then(({ error }) => {
        if (error) return onChange(false)
        return onChange(true)
      })
    }
  }

  unlinkClicked () {
    const { provider, unlinkAccount, onChange } = this.props
    unlinkAccount(provider)
    return onChange(false)
  }

  render () {
    const { label, value = '' } = this.props
    const linked = !!value

    const linkButton = <span
      styleName='link-button'
      onClick={linked ? () => this.unlinkClicked() : () => this.linkClicked()}>
      {linked ? 'Unlink' : 'Link'}
    </span>
    return <div styleName='control'>
      <div styleName={cx('social-control-label', {linked})}>{label}{linkButton}</div>
    </div>
  }
}
