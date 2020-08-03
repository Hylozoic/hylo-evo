import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import cx from 'classnames'
import { STARTED_TYPING_INTERVAL } from 'util/constants'
import AttachmentManager from 'components/AttachmentManager'
import FileStackUploader from 'components/FileStackUploader'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
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

  render () {
    const {
      currentUser,
      addAttachment,
      className
    } = this.props

    if (!currentUser) return null

    const placeholder = `Hi ${currentUser.firstName()}, what's on your mind?`

    return <div
      styleName='commentForm'
      className={className}
      onClick={() => this.editor.current.focus()}>
      <h3>Attachments</h3>
      <AttachmentManager type='comment' />
      <div styleName={'prompt'}>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        <HyloEditor
          ref={this.editor}
          styleName='editor'
          onChange={this.startTyping}
          placeholder={placeholder}
          parentComponent={'CommentForm'}
          submitOnReturnHandler={this.save} />
        <FileStackUploader type='comment' id='new' onSuccess={attachment => addAttachment('comment', 'new', attachment)} />
        {/* <UploadAttachmentButton type='comment' onSuccess={attachment => addAttachment('comment', 'new', attachment)}>
          <Icon name='Paperclip'
            styleName={cx('action-icon', { 'highlight-icon': true })} />
        </UploadAttachmentButton> */}
      </div>
    </div>
  }
}
