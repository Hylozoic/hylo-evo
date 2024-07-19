import cx from 'classnames'
import { throttle, isEmpty } from 'lodash/fp'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { IoSend } from 'react-icons/io5'
import AttachmentManager from 'components/AttachmentManager'
import Button from 'components/Button'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import RoundImage from 'components/RoundImage'
import Tooltip from 'components/Tooltip'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import { inIframe } from 'util/index'
import { STARTED_TYPING_INTERVAL } from 'util/constants'

import './CommentForm.scss'

class CommentForm extends Component {
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

  componentDidMount () {
    setTimeout(() => {
      // In case we unmounted really quick and its no longer here
      if (this.editor.current) {
        this.editor.current.focus()
      }
    }, 600)
  }

  handleOnEnter = contentHTML => {
    const {
      createComment,
      sendIsTyping,
      attachments,
      clearAttachments,
      t
    } = this.props

    if (this.editor?.current && isEmpty(attachments) && this.editor.current.isEmpty()) {
      window.alert(t('You need to include text to post a comment'))
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
    const { currentUser, className, addAttachment, editorContent, t } = this.props
    const placeholder = this.props.placeholder || this.props.t('Add a comment...')

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
            onUpdate={this.startTyping}
            placeholder={placeholder}
            ref={this.editor}
          />

          {!currentUser
            ? <Link
              to={`/login?returnToUrl=${encodeURIComponent(window.location.pathname)}`}
              target={inIframe() ? '_blank' : ''}
              styleName='signupButton'
            >
              {this.prop.t('Sign up to reply')}
            </Link>
            : (
              <>
                <div styleName='send-message-container'>
                  <Button
                    borderRadius='6px'
                    onClick={() => this.handleOnEnter(this.editor.current.getHTML())}
                    styleName='send-message-button'
                    dataTip={t('You need to include text to post a comment')}
                    dataFor='comment-submit-tt'
                  >
                    <IoSend color='white' />
                  </Button>
                  <Tooltip
                    delay={150}
                    position='top'
                    offset={{ bottom: 0 }}
                    id='comment-submit-tt'
                  />
                </div>
                <UploadAttachmentButton
                  type='comment'
                  id='new'
                  allowMultiple
                  onSuccess={addAttachment}
                  customRender={renderProps => (
                    <UploadButton {...renderProps} styleName='upload-button' />
                  )}
                />
              </>
            )
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

export default withTranslation()(CommentForm)
