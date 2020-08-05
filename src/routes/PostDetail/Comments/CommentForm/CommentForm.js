import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { throttle } from 'lodash'
import { STARTED_TYPING_INTERVAL } from 'util/constants'
import AttachmentManager from 'components/AttachmentManager'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
// import Icon from 'components/Icon'
// import cx from 'classnames'
import './CommentForm.scss'

export default class CommentForm extends Component {
  static propTypes = {
    postId: PropTypes.string.isRequired,
    createComment: PropTypes.func.isRequired,
    currentUser: PropTypes.object.isRequired,
    className: PropTypes.string,
    // provided by connector
    sendIsTyping: PropTypes.func.isRequired,
    addAttachment: PropTypes.func.isRequired,
    clearAttachments: PropTypes.func.isRequired,
    attachments: PropTypes.array
  }

  editor = React.createRef()

  startTyping = throttle((editorState, stateChanged) => {
    if (editorState.getLastChangeType() === 'insert-characters' && stateChanged) {
      this.props.sendIsTyping(true)
    }
  }, STARTED_TYPING_INTERVAL)

  save = text => {
    const {
      createComment,
      sendIsTyping,
      attachments,
      clearAttachments
    } = this.props

    this.startTyping.cancel()
    sendIsTyping(false)
    createComment({
      text,
      attachments
    })
    clearAttachments()
  }

  render () {
    const { currentUser, className, addAttachment } = this.props

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
        <UploadAttachmentButton
          type='comment'
          id='new'
          onSuccess={addAttachment}
          // customRender={renderProps =>
          //   <UploadButton {...renderProps} />
          // }
        />
      </div>
    </div>
  }
}

// export const UploadButton = ({
//   onClick,
//   disable,
//   loading
// }) => {
//   return <Icon name='AddImage' styleName={cx('action-icon', 'highlight-icon')} />
// }

// export function UploadButton ({
//   loading,
//   onClick,
//   className,
//   iconName = 'AddImage'
// }) {
//   const loadingIconName = loading ? 'Clock' : iconName

//   return <div onClick={onClick} className={className}>
//     <Icon name={loadingIconName} styleName={cx('icon')} />
//   </div>
// }
