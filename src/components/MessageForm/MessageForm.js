import React from 'react'
import { throttle } from 'lodash'
import { get } from 'lodash/fp'
import { onEnterNoShift } from 'util/textInput'
import { socketUrl } from 'client/websockets'
import RoundImage from 'components/RoundImage'
var { func, object, string, bool } = React.PropTypes
import './MessageForm.scss'

// should share with comment form
export const STARTED_TYPING_INTERVAL = 3000

export const NEW_THREAD_ID = 'new'

export default class MessageForm extends React.Component {
  static propTypes = {
    socket: object,
    text: string,
    className: string,
    currentUser: object,
    messageThreadId: string,
    placeholder: string,
    onFocus: func,
    onBlur: func,
    pending: bool,
    forNewThread: bool,
    createMessage: func,
    updateMessageText: func,
    findOrCreateThread: func,
    goToThread: func
  }

  sendForExisting () {
    const { createMessage, messageThreadId, text } = this.props
    createMessage(messageThreadId, text)
    this.startTyping.cancel()
    this.sendIsTyping(false)
  }

  initiateNewThread () {
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
      this.initiateNewThread()
    } else {
      this.sendForExisting()
    }
    return false
  }

  componentDidMount () {
    this.resize()
  }

  componentDidUpdate (prevProps) {
    if (prevProps.text !== this.props.text) this.resize()
  }

  focus () {
    this.refs.editor.focus()
  }

  isFocused () {
    return this.refs.editor === document.activeElement
  }

  sendIsTyping (isTyping) {
    const { messageThreadId, socket } = this.props
    socket.post(socketUrl(`/noo/post/${messageThreadId}/typing`), {isTyping})
  }

  // broadcast "I'm typing!" every 3 seconds starting when the user is typing.
  // We send repeated notifications to make sure that a user gets notified even
  // if they load a comment thread after someone else has already started
  // typing.
  startTyping = throttle(() => {
    this.sendIsTyping(true)
  }, STARTED_TYPING_INTERVAL)

  resize = () => {
    const editor = this.refs.editor
    const cloned = editor.cloneNode()
    cloned.style.height = 0
    editor.parentElement.appendChild(cloned)
    if (editor.style.height !== cloned.scrollHeight + 'px') {
      editor.style.height = cloned.scrollHeight + 'px'
    }
    editor.parentElement.removeChild(cloned)
  }

  render () {
    const {
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

    return <form onSubmit={this.submit} styleName='message-form'
      className={className}>
      <RoundImage url={get('avatarUrl', currentUser)} styleName='user-image'
        medium />
      <textarea ref='editor' value={text} styleName='message-textarea'
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={onChange}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        disabled={pending} />
    </form>
  }
}
