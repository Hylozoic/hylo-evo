import cx from 'classnames'
import { throttle, isEmpty } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as HyloContentState from 'components/HyloEditor/HyloContentState'
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
    focusOnRender: PropTypes.bool,
    editorContent: PropTypes.string, // passed as HTML: wrap in <p></p>
    // provided by connector
    sendIsTyping: PropTypes.func.isRequired,
    addAttachment: PropTypes.func.isRequired,
    clearAttachments: PropTypes.func.isRequired,
    attachments: PropTypes.array
  }

  editor = React.createRef()

  startTyping = throttle(STARTED_TYPING_INTERVAL, (editorState, stateChanged) => {
    if (editorState.getLastChangeType() === 'insert-characters' && stateChanged) {
      this.props.sendIsTyping(true)
    }
  })

  save = editorState => {
    const {
      createComment,
      sendIsTyping,
      attachments,
      clearAttachments
    } = this.props
    const contentState = editorState.getCurrentContent()
    if ((!contentState.hasText() || isEmpty(contentState.getPlainText().trim())) && isEmpty(attachments)) {
      // Don't accept empty comments.
      return
    }
    const text = HyloContentState.toHTML(editorState.getCurrentContent())

    this.startTyping.cancel()
    sendIsTyping(false)
    createComment({
      text,
      attachments
    })
    clearAttachments()
  }

  render () {
    const { currentUser, className, addAttachment, focusOnRender, editorContent } = this.props

    const placeholder = this.props.placeholder || 'Add a comment...'

    return <div
      styleName='commentForm'
      className={className}
    >
      {currentUser && (
        <AttachmentManager type='comment' id='new' />
      )}
      <div styleName={cx('prompt', { 'disabled': !currentUser })}>
        {currentUser
          ? <RoundImage url={currentUser.avatarUrl} small styleName='image' />
          : <Icon name='Person' styleName='anonymous-image' />
        }
        <HyloEditor
          ref={this.editor}
          styleName='editor'
          readOnly={!currentUser}
          onChange={this.startTyping}
          focusOnRender={focusOnRender}
          placeholder={placeholder}
          parentComponent={'CommentForm'}
          submitOnReturnHandler={this.save}
          contentHTML={editorContent}
        />

        {!currentUser
          ? <Link to={'/login?returnToUrl=' + encodeURIComponent(window.location.pathname)} target={inIframe() ? '_blank' : ''} styleName='signupButton'>Sign up to reply</Link>
          : <UploadAttachmentButton
            type='comment'
            id='new'
            allowMultiple
            onSuccess={addAttachment}
            customRender={renderProps =>
              <UploadButton {...renderProps} styleName='upload-button' />
            }
          />
        }
      </div>
    </div>
  }
}

export function UploadButton ({
  onClick,
  loading,
  className
}) {
  return <div onClick={onClick} className={className}>
    {loading && <Loading type='inline' styleName='upload-button-loading' />}
    {!loading && <Icon name='AddImage' styleName='upload-button-icon' />}
  </div>
}
