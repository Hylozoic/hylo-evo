import cx from 'classnames'
import { throttle } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import AttachmentManager from 'components/AttachmentManager'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import { inIframe } from 'util/index'
import { STARTED_TYPING_INTERVAL } from 'util/constants'

import './CommentForm.scss'

export default class CommentForm extends Component {
  static propTypes = {
    createComment: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    editorContent: PropTypes.string,
    // provided by connector
    sendIsTyping: PropTypes.func.isRequired,
    addAttachment: PropTypes.func.isRequired,
    clearAttachments: PropTypes.func.isRequired,
    attachments: PropTypes.array
  }

  editor = React.createRef()

  startTyping = throttle(STARTED_TYPING_INTERVAL, () => {
    this.props.sendIsTyping(true)
  })

  handleOnEnter = contentHTML => {
    const {
      createComment,
      sendIsTyping,
      attachments,
      clearAttachments
    } = this.props

    if (this.editor?.current && this.editor.current.isEmpty()) {
      // Do nothing and stop event propagation
      return true
    }

    this.editor.current.clearContent()
    this.startTyping.cancel()
    sendIsTyping(false)
    createComment({ text: contentHTML, attachments })
    clearAttachments()

    // Tell Editor this keyboard event was handled and to end propagation.
    return true
  }

  render () {
    const { currentUser, className, addAttachment, editorContent } = this.props
    const placeholder = this.props.placeholder || 'Add a comment...'

    return (
      <div
        styleName='commentForm'
        className={className}
      >
        {currentUser && (
          <AttachmentManager type='comment' id='new' />
        )}
        <div styleName={cx('prompt', { disabled: !currentUser })}>
          {currentUser
            ? <RoundImage url={currentUser.avatarUrl} small styleName='image' />
            : <Icon name='Person' styleName='anonymous-image' />
          }
          <HyloEditor
            contentHTML={editorContent}
            onEnter={this.handleOnEnter}
            styleName='editor'
            readOnly={!currentUser}
            onChange={this.startTyping}
            placeholder={placeholder}
            ref={this.editor}
          />

          {!currentUser
            ? <Link
              to={`/login?returnToUrl=${encodeURIComponent(window.location.pathname)}`}
              target={inIframe() ? '_blank' : ''}
              styleName='signupButton'
            >
              Sign up to reply
            </Link>
            : <UploadAttachmentButton
              type='comment'
              id='new'
              allowMultiple
              onSuccess={addAttachment}
              customRender={renderProps => (
                <UploadButton {...renderProps} styleName='upload-button' />
              )}
            />
          }
        </div>
      </div>
    )
  }
}

export function UploadButton ({
  onClick,
  loading,
  className
}) {
  return (
    <div onClick={onClick} className={className}>
      {loading && <Loading type='inline' styleName='upload-button-loading' />}
      {!loading && <Icon name='AddImage' styleName='upload-button-icon' />}
    </div>
  )
}
