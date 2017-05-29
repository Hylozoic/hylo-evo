import React, { PropTypes, Component } from 'react'
import './CommentForm.scss'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
const { object, func, string } = PropTypes
import { throttle } from 'lodash'

export const STARTED_TYPING_INTERVAL = 3000

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: object,
    createComment: func,
    className: string,
    placeholderText: string
  }

  startTyping = throttle((editorState, stateChanged) => {
    if (editorState.getLastChangeType() === 'insert-characters' && stateChanged) {
      this.props.sendIsTyping(true)
    }
  }, STARTED_TYPING_INTERVAL)

  save = text => {
    this.startTyping.cancel()
    this.props.sendIsTyping(false)
    this.props.createComment(text)
  }

  render () {
    const { currentUser, className } = this.props
    if (!currentUser) return null

    const placeholder = `Hi ${currentUser.firstName()}, what's on your mind?`
    return <div styleName='commentForm' className={className}
      onClick={() => this.editor.getWrappedInstance().focus()}>
      <div styleName={'prompt'}>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        <HyloEditor
          ref={x => { this.editor = x }}
          styleName='editor'
          onChange={this.startTyping}
          placeholder={placeholder}
          submitOnReturnHandler={this.save} />
      </div>
    </div>
  }
}
