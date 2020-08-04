import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import { STARTED_TYPING_INTERVAL } from 'util/constants'
import AttachmentManager from 'components/AttachmentManager'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import cx from 'classnames'
import './CommentForm.scss'

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: PropTypes.object,
    createComment: PropTypes.func,
    sendIsTyping: PropTypes.func,
    attachments: PropTypes.array,
    addAttachment: PropTypes.func,
    clearAttachments: PropTypes.func,
    className: PropTypes.string
  }

  editor = React.createRef()

  startTyping = throttle((editorState, stateChanged) => {
    if (editorState.getLastChangeType() === 'insert-characters' && stateChanged) {
      this.props.sendIsTyping(true)
    }
  }, STARTED_TYPING_INTERVAL)

  save = text => {
    const {
      sendIsTyping,
      createComment,
      attachments,
      clearAttachments
    } = this.props

    this.startTyping.cancel()
    sendIsTyping(false)
    createComment({
      text,
      attachments
    })
    clearAttachments('comment')
  }

  addAttachment = attachment => this.props.addAttachment('comment', 'new', attachment)

  render () {
    const { currentUser, className } = this.props

    if (!currentUser) return null

    const placeholder = `Hi ${currentUser.firstName()}, what's on your mind?`

    return <div
      styleName='commentForm'
      className={className}
      onClick={() => this.editor.current.focus()}>
      <AttachmentManager type='comment' id='new' />
      <div styleName={'prompt'}>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        <HyloEditor
          ref={this.editor}
          styleName='editor'
          onChange={this.startTyping}
          placeholder={placeholder}
          parentComponent={'CommentForm'}
          submitOnReturnHandler={this.save} />
        <UploadAttachmentButton type='comment' id='new' onSuccess={this.addAttachment}>
          <Icon name='AddImage' styleName={cx('action-icon', { 'highlight-icon': true })} />
        </UploadAttachmentButton>
      </div>
    </div>
  }
}
