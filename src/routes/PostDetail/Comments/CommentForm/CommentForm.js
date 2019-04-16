import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import { STARTED_TYPING_INTERVAL } from 'util/constants'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import './CommentForm.scss'

const { object, func, string } = PropTypes

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
      onClick={() => this.editor.focus()}>
      <div styleName={'prompt'}>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        <HyloEditor
          ref={x => { this.editor = x }}
          styleName='editor'
          onChange={this.startTyping}
          placeholder={placeholder}
          parentComponent={'CommentForm'}
          submitOnReturnHandler={this.save} />
      </div>
    </div>
  }
}
