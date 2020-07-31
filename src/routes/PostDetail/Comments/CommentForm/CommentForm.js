import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { pullAt, throttle } from 'lodash'
import cx from 'classnames'
import { STARTED_TYPING_INTERVAL } from 'util/constants'
import { bgImageStyle } from 'util/index'
import RoundImage from 'components/RoundImage'
import HyloEditor from 'components/HyloEditor'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import './CommentForm.scss'

const { object, func, string } = PropTypes

export default class CommentForm extends Component {
  static propTypes = {
    currentUser: object,
    createComment: func,
    className: string,
    placeholderText: string
  }

  state = {
    attachments: []
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

  addAttachment = attachment => {
    console.log('!!!! attachment', attachment)
    this.setState(prevState => ({
      attachments: [
        ...prevState.attachments,
        attachment
      ]
    }))
  }

  removeAttachment = index => {
    this.setState(prevState => ({
      attachments: [
        ...pullAt(index, prevState.attachments)
      ]
    }))
  }

  clearAttachments = () => {
    this.setState(() => ({
      attachments: []
    }))
  }

  save = text => {
    const attachments = this.state.attachments

    this.startTyping.cancel()
    this.props.sendIsTyping(false)
    this.props.createComment({ text, attachments })
    this.clearAttachments()
  }

  render () {
    const { currentUser, className } = this.props
    const { attachments } = this.state

    if (!currentUser) return null

    const placeholder = `Hi ${currentUser.firstName()}, what's on your mind?`

    return <div
      styleName='commentForm'
      className={className}
      onClick={() => this.editor.current.focus()}>
      <div>
        {attachments && attachments.map(({ url }, index) =>
          <ImagePreview
            url={url}
            removeImage={this.removeAttachment}
            switchImages={() => {}}
            position={index}
            key={index}
          />
        )}
      </div>
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
        <UploadAttachmentButton type='comment' onSuccess={this.addAttachment}>
          <Icon name='Paperclip'
            styleName={cx('action-icon', { 'highlight-icon': true })} />
        </UploadAttachmentButton>
      </div>
    </div>
  }
}

export function ImagePreview ({
  url,
  removeImage,
  position,
  connectDragPreview
}) {
  return <div styleName='image-preview'>
    <div style={bgImageStyle(url)} styleName='image'>
      <Icon name='Ex' styleName='remove-image' onClick={() => removeImage(position)} />
      {connectDragPreview && connectDragPreview(<div styleName='drag-preview' />)}
    </div>
  </div>
}
