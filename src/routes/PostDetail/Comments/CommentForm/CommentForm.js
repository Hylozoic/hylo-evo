import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import cx from 'classnames'
import { STARTED_TYPING_INTERVAL } from 'util/constants'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import AttachmentManager from 'components/AttachmentManager'
import './CommentForm.scss'

const { object, func, string } = PropTypes

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: object,
    createComment: func,
    className: string,
    placeholderText: string
  }
  constructor (props) {
    super(props)

    this.editor = React.createRef()
  }

  startTyping = throttle((editorState, stateChanged) => {
    if (editorState.getLastChangeType() === 'insert-characters' && stateChanged) {
      this.props.sendIsTyping(true)
    }
  }, STARTED_TYPING_INTERVAL)

  save = text => {
    this.startTyping.cancel()
    this.props.sendIsTyping(false)
    this.props.createComment({ text })
    this.props.clearAttachments()
  }

  render () {
    const {
      currentUser,
      addImage,
      addFile,
      className
    } = this.props

    if (!currentUser) return null

    const placeholder = `Hi ${currentUser.firstName()}, what's on your mind?`

    return <div
      styleName='commentForm'
      className={className}
      onClick={() => this.editor.current.focus()}>
      <div styleName={'prompt'}>
        <RoundImage url={currentUser.avatarUrl} small styleName='image' />
        <HyloEditor
          ref={this.editor}
          styleName='editor'
          onChange={this.startTyping}
          placeholder={placeholder}
          parentComponent={'CommentForm'}
          submitOnReturnHandler={this.save} />
      </div>
      <div styleName='footer'>
        <AttachmentManager type='comment' attachmentType='image' />
        <AttachmentManager type='comment' attachmentType='file' />
        <UploadAttachmentButton
          type='comment'
          attachmentType='image'
          update={addImage}>
          <Icon name='AddImage'
            styleName={cx('action-icon', { 'highlight-icon': true })} />
        </UploadAttachmentButton>
        <UploadAttachmentButton
          type='comment'
          attachmentType='file'
          update={addFile}>
          <Icon name='Paperclip'
            styleName={cx('action-icon', { 'highlight-icon': true })} />
        </UploadAttachmentButton>
      </div>
    </div>
  }
}
