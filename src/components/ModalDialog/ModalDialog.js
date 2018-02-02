import React, { Component } from 'react'
import { func, node, bool, string } from 'prop-types'

import Button from 'components/Button'
import Icon from 'components/Icon'

import './ModalDialog.scss'

export default class ModalDialog extends Component {
  static propTypes = {
    cancelButtonAction: bool,
    children: node,
    modalTitle: string,
    showCancelButton: bool,
    submitButtonAction: func,
    submitButtonIsDisabled: func,
    submitButtonText: string
  }

  static defaultProps = {
    modalTitle: 'Notice',
    showCancelButton: true,
    submitButtonIsDisabled: () => false,
    submitButtonText: 'Ok'
  }

  cancel = () => {
    if (this.props.cancelButtonAction) this.props.cancelButtonAction()
    this.props.closeModal()
  }

  submit = () => {
    if (this.props.submitButtonAction) this.props.submitButtonAction()
    this.props.closeModal()
  }

  render () {
    const {
      children,
      showCancelButton,
      submitButtonIsDisabled,
      submitButtonText,
      modalTitle
    } = this.props
    return <div styleName='popup'>
      <div styleName='popup-inner'>
        <h1>{modalTitle}</h1>
        <span onClick={this.cancel} styleName='close-btn'>
          <Icon name='Ex' styleName='icon' />
        </span>

        <div styleName='content'>
          {children}
        </div>
        <div styleName='controls'>
          {showCancelButton && <Button
            color='green-white-green-border'
            styleName='cancel-btn'
            onClick={this.cancel}>Cancel</Button>}
          <Button
            styleName='submit-btn'
            onClick={this.submit}
            disabled={submitButtonIsDisabled()}>{submitButtonText}</Button>
        </div>
      </div>
    </div>
  }
}
