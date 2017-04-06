import React from 'react'
import { throttle } from 'lodash'
import { onEnterNoShift } from 'util/textInput'
// import { getSocket, socketUrl } from '../../client/websockets'
var { func, object, string, bool } = React.PropTypes
import './MessageForm.scss'

// should share with comment form
export const STARTED_TYPING_INTERVAL = 3000

export default class MessageForm extends React.Component {
  static propTypes = {
    currentUser: object,
    postId: string,
    placeholder: string,
    onFocus: func,
    onBlur: func,
    pending: bool,
    createComment: func
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  submit = event => {
    if (event) event.preventDefault()
    if (!this.state.text) return false
    const { postId, createComment } = this.props
    const { currentUser } = this.context
    const userId = currentUser.id
    const { text } = this.state
    createComment({postId, text, userId})
    this.startTyping.cancel()
    this.sendIsTyping(false)
    this.setState({text: ''})
    return false
  }

  componentDidMount () {
    // this.socket = getSocket()
  }

  focus () {
    this.refs.editor.focus()
  }

  isFocused () {
    return this.refs.editor === document.activeElement
  }

  sendIsTyping (isTyping) {
    const { postId } = this.props
    if (this.socket) {
      this.socket.post(socketUrl(`/noo/post/${postId}/typing`), {isTyping})
    }
  }

  // broadcast "I'm typing!" every 5 seconds starting when the user is typing.
  // We send repeated notifications to make sure that a user gets notified even
  // if they load a comment thread after someone else has already started
  // typing.
  startTyping = throttle(() => {
    this.sendIsTyping(true)
  }, STARTED_TYPING_INTERVAL)

  render () {
    const { onFocus, onBlur } = this.props
    const placeholder = this.props.placeholder || 'Type a message...'
    const { text } = this.state

    const handleKeyDown = e => {
      this.startTyping()
      onEnterNoShift(e => {
        e.preventDefault()
        this.submit()
      }, e)
    }

    return <form onSubmit={this.submit} className='message-form'>
      <textarea ref='editor' name='message' value={text}
        placeholder={placeholder}
        onFocus={onFocus}
        onChange={e => this.setState({text: e.target.value})}
        onBlur={onBlur}
        onKeyUp={this.stopTyping}
        onKeyDown={handleKeyDown} />
    </form>
  }
}
