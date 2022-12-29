import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import cx from 'classnames'
import Icon from 'components/Icon'
import './SocialControl.scss'

const { func, string } = PropTypes

class SocialControl extends Component {
  static propTypes = {
    label: string,
    provider: string,
    value: string,
    updateSettingDirectly: func,
    handleUnlinkAccount: func,
    onLink: func,
    fetchLocation: func
  }

  windowPrompt (network, urlPattern) {
    const promptText = this.props.t(`Please enter the full url for your {{network}} page.`, { network })
    const invalidUrlText = this.props.t(`Invalid url. Please enter the full url for your {{network}} page.`, { network })

    let url = window.prompt(promptText)

    if (url) {
      while (!url.match(urlPattern)) {
        url = window.prompt(invalidUrlText)
      }
    }
    return url
  }

  handleLinkClick () {
    const { provider, updateSettingDirectly } = this.props

    switch (provider) {
      case 'twitter': {
        const twitterHandle = window.prompt(this.props.t('Please enter your twitter name.'))
        if (twitterHandle) {
          updateSettingDirectly()(twitterHandle)
        }
        break
      }
      case 'linkedin': {
        const network = 'LinkedIn'
        const urlPattern = /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com/
        const url = this.windowPrompt(network, urlPattern)
        if (url) {
          updateSettingDirectly()(url)
        }
        break
      }
      case 'facebook': {
        const network = 'Facebook'
        const urlPattern = /^(http(s)?:\/\/)?([\w]+\.)?facebook\.com/
        const url = this.windowPrompt(network, urlPattern)
        if (url) {
          updateSettingDirectly()(url)
        }
        break
      }
    }
  }

  handleUnlinkClick () {
    const { handleUnlinkAccount, updateSettingDirectly } = this.props

    handleUnlinkAccount()
    updateSettingDirectly()(null)
  }

  render () {
    const { label, value = '', provider, onLink } = this.props
    const linked = !!value

    const linkButton =
      <span
        styleName='link-button'
        onClick={linked ? () => this.handleUnlinkClick() : () => this.handleLinkClick()}>
        {linked ? this.props.t('Unlink') : this.props.t('Link')}

      </span>

    const connectFacebookButton =
      <span
        styleName='link-button'
        onClick={linked ? () => this.handleUnlinkClick() : () => onLink()}
        className='ml-auto'
      >
        {linked ? this.props.t('Disconnect') : this.props.t('Connect')}
      </span>

    return (
      <div styleName='control'>
        <div styleName={cx('social-control-label')}>
          {linked ? <Icon name='Complete' styleName='linkedIcon' /> : ''}
          {label}
          {provider === 'facebook' && connectFacebookButton}
          {linkButton}
        </div>
      </div>
    )
  }
}

export default withTranslation()(SocialControl)
