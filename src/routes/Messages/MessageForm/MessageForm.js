import PropTypes from 'prop-types'
import React from 'react'
import { throttle } from 'lodash'
import { get } from 'lodash/fp'
import TextareaAutosize from 'react-textarea-autosize'
import { onEnterNoShift } from 'util/textInput'
import RoundImage from 'components/RoundImage'
import Loading from 'components/Loading'
import './MessageForm.scss'

var { func, object, string, bool } = PropTypes

// should share with comment form
export const STARTED_TYPING_INTERVAL = 3000

export const NEW_THREAD_ID = 'new'

export default class MessageForm extends React.Component {
  static propTypes = {
    createMessage: func.isRequired,
    messageThreadId: string,
    messageText: string,
    focusForm: func,
    sendIsTyping: func,
    findOrCreateThread: func,
    goToThread: func,
    pending: bool,
    forNewThread: bool,
    formRef: func,
    className: string,
    currentUser: object,
    updateMessageText: func,
    placeholder: string
  }

  static defaultProps = {
    placeholder: 'Write something...'
  }

  sendForExisting () {
    const { createMessage, messageThreadId, messageText } = this.props
    createMessage(messageThreadId, messageText).then(() => this.props.focusForm())
    this.startTyping.cancel()
    this.props.sendIsTyping(false)
  }

  handleThreadThenMessage () {
    const { createMessage, findOrCreateThread, goToThread, messageText } = this.props
    findOrCreateThread().then(resp => {
      const messageThreadId = get('payload.data.findOrCreateThread.id', resp)
      createMessage(messageThreadId, messageText, true).then(() => goToThread(messageThreadId))
    })
  }

  submit = event => {
    if (event) event.preventDefault()
    const { messageText, pending, forNewThread } = this.props
    if (!messageText || pending) return false
    if (forNewThread) {
      this.handleThreadThenMessage()
    } else {
      this.sendForExisting()
    }
    return false
  }

  handleOnChange = event => {
    const { forNewThread, messageThreadId, updateMessageText } = this.props
    const threadId = forNewThread ? NEW_THREAD_ID : messageThreadId

    updateMessageText(threadId, event.target.value)
  }

  handleKeyDown = event => {
    this.startTyping()
    onEnterNoShift(e => {
      e.preventDefault()
      this.submit()
    }, event)
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
      <TextareaAutosize value={messageText} styleName='message-textarea'
        inputRef={formRef}
        onChange={this.handleOnChange}
        onKeyDown={this.handleKeyDown}
        placeholder={placeholder} />
    </form>
  }
}
