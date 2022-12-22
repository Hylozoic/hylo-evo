import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { bool, func, node, string } from 'prop-types'

import { bgImageStyle } from 'util/index'
import Button from 'components/Button'
import Icon from 'components/Icon'

import './ModalDialog.scss'

class ModalDialog extends Component {
  static propTypes = {
    // Any image in assets (filename or path relative to /assets).
    // Will be shown at bottom left of dialog.
    backgroundImage: string,

    // Cancel always closes the dialog, but will invoke this first if present
    cancelButtonAction: func,

    // Default: true. Set to false if you need to show a notification afterward
    closeOnSubmit: bool,

    // Content to render in the body of the dialog
    children: node,

    // Only visible when `useNotificationFormat` is false
    modalTitle: string,

    // Only shown if `useNotificationFormat` is true
    notificationIconName: string,

    // Default: true
    showCancelButton: bool,

    // Default: true
    showSubmitButton: bool,

    // Submit will invoke this if present
    submitButtonAction: func,

    // Function should return truthy if Submit should show greyed out.
    submitButtonIsDisabled: func,

    submitButtonText: string,

    // Uses alternate format with green bolded text, +/- an icon
    useNotificationFormat: bool,

    // Default: true
    showModalTitle: bool
  }

  static defaultProps = {
    closeOnSubmit: true,
    style: { },
    modalTitle: 'Notice',
    showModalTitle: true,
    showCancelButton: true,
    showSubmitButton: true,
    submitButtonIsDisabled: () => false,
    submitButtonText: 'Ok', /* TODO: Handle this translation */
    useNotificationFormat: false
  }

  componentDidMount () {
    // disable main window scrolling
    this.previousOverflowStyle = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  componentWillUnmount () {
    // re-enable main window scrolling
    document.body.style.overflow = this.previousOverflowStyle
  }

  cancel = () => {
    if (this.props.cancelButtonAction) this.props.cancelButtonAction()
    this.props.closeModal()
  }

  submit = () => {
    if (this.props.submitButtonAction) this.props.submitButtonAction()
    if (this.props.closeOnSubmit) this.props.closeModal()
  }

  render () {
    const {
      backgroundImage,
      children,
      modalTitle,
      notificationIconName,
      showCancelButton,
      showSubmitButton,
      submitButtonIsDisabled,
      submitButtonText,
      showModalTitle,
      useNotificationFormat,
      style
    } = this.props

    const backgroundStyle = backgroundImage && useNotificationFormat
      ? {
        ...bgImageStyle(`/assets/${backgroundImage}`),
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom left',
        backgroundSize: '180px'
      }
      : {}
    const innerStyle = { ...backgroundStyle, ...style }
    const showControls = showCancelButton || showSubmitButton

    return <div styleName='popup'>
      <div styleName='popup-inner' style={innerStyle}>
        <span onClick={this.cancel} styleName='close-btn'>
          <Icon name='Ex' styleName='icon' />
        </span>

        <div styleName='title-block'>
          {useNotificationFormat &&
            <Icon green name={notificationIconName} styleName='notification-icon' />}
          {showModalTitle && <h1 styleName={useNotificationFormat ? 'notification-title' : ''}>
            {modalTitle}
          </h1>}
        </div>

        <div styleName='content'>
          {children}
        </div>

        {showControls && <div styleName='controls'>
          {showCancelButton && <Button
            color='green-white-green-border'
            styleName='cancel-btn'
            onClick={this.cancel}>{this.props.t('Cancel')}</Button>}
          {showSubmitButton && <Button
            styleName='submit-btn'
            onClick={this.submit}
            disabled={submitButtonIsDisabled()}>{submitButtonText}</Button>}
        </div>}
      </div>
    </div>
  }
}
export default withTranslation()(ModalDialog)
