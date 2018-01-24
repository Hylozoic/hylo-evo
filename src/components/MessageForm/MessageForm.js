import PropTypes from 'prop-types'
import React from 'react'
import { throttle } from 'lodash'
import { get } from 'lodash/fp'
import TextareaAutosize from 'react-textarea-autosize'
import { onEnterNoShift } from 'utils/textInput'
import RoundImage from 'components/RoundImage'
import './MessageForm.scss'
var { func, object, string, bool } = PropTypes

// should share with comment form
export const STARTED_TYPING_INTERVAL = 3000

export const NEW_THREAD_ID = 'new'

export default class MessageForm extends React.Component {
  static propTypes = {
    createMessage: func,
    currentUser: object,
    findOrCreateThread: func,
    focusForm: func,
    formRef: func,
    forNewThread: bool,
    goToThread: func,
    messageThreadId: string,
    onFocus: func,
    onBlur: func,
    pending: bool,
    placeholder: string,
    text: string,
    updateMessageText: func
  }

  sendForExisting () {
    const { createMessage, messageThreadId, text } = this.props
    createMessage(messageThreadId, text).then(() => this.props.focusForm())
    this.startTyping.cancel()
    this.props.sendIsTyping(false)
  }

  handleThreadThenMessage () {
    const { createMessage, findOrCreateThread, goToThread, text } = this.props
    findOrCreateThread().then(resp => {
      const messageThreadId = get('payload.data.findOrCreateThread.id', resp)
      createMessage(messageThreadId, text, true).then(() => goToThread(messageThreadId))
    })
  }

  submit = event => {
    if (event) event.preventDefault()
    const { text, pending, forNewThread } = this.props
    if (!text || pending) return false
    if (forNewThread) {
      this.handleThreadThenMessage()
    } else {
      this.sendForExisting()
    }
    return false
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
      formRef,
      forNewThread,
      messageThreadId,
      onFocus,
      onBlur,
      className,
      currentUser,
      pending,
      updateMessageText
    } = this.props
    const threadId = forNewThread ? NEW_THREAD_ID : messageThreadId
    const text = pending ? '' : this.props.text
    const placeholder = this.props.placeholder || 'Write something...'
    const onChange = e => updateMessageText(threadId, e.target.value)
    const handleKeyDown = e => {
      this.startTyping()
      onEnterNoShift(e => {
        e.preventDefault()
        this.submit()
      }, e)
    }

    return <form styleName='message-form' className={className} onSubmit={this.submit}>
      <RoundImage url={get('avatarUrl', currentUser)} styleName='user-image' medium />
      <TextareaAutosize value={text} styleName='message-textarea'
        disabled={pending}
        inputRef={formRef}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder} />
    </form>
  }
}
