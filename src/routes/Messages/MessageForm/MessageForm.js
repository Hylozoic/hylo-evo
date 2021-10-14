import PropTypes from 'prop-types'
import React from 'react'
import { throttle } from 'lodash'
import { get } from 'lodash/fp'
import TextareaAutosize from 'react-textarea-autosize'
import { onEnterNoShift } from 'util/textInput'
import { STARTED_TYPING_INTERVAL } from 'util/constants'
import RoundImage from 'components/RoundImage'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import './MessageForm.scss'

export default class MessageForm extends React.Component {
  static defaultProps = {
    placeholder: 'Write something...'
  }

  submit = event => {
    if (event) event.preventDefault()
    this.startTyping.cancel()
    this.props.sendIsTyping(false)
    this.props.updateMessageText()
    this.props.onSubmit()
  }

  handleOnChange = event => {
    this.props.updateMessageText(event.target.value)
  }

  handleKeyDown = event => {
    this.startTyping()
    onEnterNoShift(this.submit, event)
  }

  // broadcast "I'm typing!" every 3 seconds starting when the user is typing.
  // We send repeated notifications to make sure that a user gets notified even
  // if they load a comment thread after someone else has already started
  // typing.
  startTyping = throttle(() => {
    this.props.sendIsTyping(true)
  }, STARTED_TYPING_INTERVAL)

  render () {
    const {
      messageText,
      formRef,
      className,
      currentUser,
      pending,
      placeholder
    } = this.props

    if (pending) return <Loading />

    return <form styleName='message-form' className={className} onSubmit={this.submit}>
      <RoundImage url={get('avatarUrl', currentUser)} styleName='user-image' medium />
      <TextareaAutosize
        value={messageText}
        styleName='message-textarea'
        inputRef={formRef}
        minRows={1}
        maxRows={8}
        onChange={this.handleOnChange}
        onKeyDown={this.handleKeyDown}
        placeholder={placeholder} />
      <button styleName='send-button'>
        <Icon name='Reply' styleName='reply-icon' />
      </button>
    </form>
  }
}

MessageForm.propTypes = {
  className: PropTypes.string,
  currentUser: PropTypes.object,
  formRef: PropTypes.object,
  messageText: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  pending: PropTypes.bool,
  placeholder: PropTypes.string,
  sendIsTyping: PropTypes.func,
  updateMessageText: PropTypes.func
}
