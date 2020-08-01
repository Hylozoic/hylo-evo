import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import cx from 'classnames'
import { STARTED_TYPING_INTERVAL } from 'util/constants'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import './CommentForm.scss'
import AttachmentManager from 'components/AttachmentManager'
// https://stackoverflow.com/questions/53683186/error-withref-is-removed-to-access-the-wrapped-instance-use-a-ref-on-the-conne
const { object, func, string } = PropTypes

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: object,
    createComment: func,
    className: string,
    placeholderText: string
  }

  editor = React.createRef()

  startTyping = throttle((editorState, stateChanged) => {
    if (editorState.getLastChangeType() === 'insert-characters' && stateChanged) {
      this.props.sendIsTyping(true)
    }
  }, STARTED_TYPING_INTERVAL)

  save = text => {
    const attachments = this.getAttachments()

    this.startTyping.cancel()
    this.props.sendIsTyping(false)
    this.props.createComment({ text, attachments })
    this.clearAttachments()
  }

  render () {
    const { currentUser, addAttachment, className } = this.props

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
        <AttachmentManager type='comment' />
        <UploadAttachmentButton type='comment' onSuccess={addAttachment}>
          <Icon name='Paperclip'
            styleName={cx('action-icon', { 'highlight-icon': true })} />
        </UploadAttachmentButton>
      </div>
    </div>
  }
}
