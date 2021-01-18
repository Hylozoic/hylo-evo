import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import { filter, isEmpty, isFunction } from 'lodash/fp'
import { humanDate, present, sanitize } from 'hylo-utils/text'
import { personUrl } from 'util/navigation'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import ClickCatcher from 'components/ClickCatcher'
import HyloEditor from 'components/HyloEditor'
import contentStateToHTML from 'components/HyloEditor/contentStateToHTML'
import CardImageAttachments from 'components/CardImageAttachments'
import CardFileAttachments from 'components/CardFileAttachments'
import CommentForm from '../CommentForm'
import './Comment.scss'

const { object, func, string } = PropTypes

export default class Comment extends Component {
  static propTypes = {
    comment: object.isRequired,
    postId: string.isRequired,
    createComment: func.isRequired
  }

  static defaultProps = {
    attachments: []
  }

  state = {
    editing: false,
    replying: false
  }

  editComment = () => {
    this.setState({ editing: true })
  }

  toggleReplyComment = () => {
    this.setState({ replying: !this.state.replying })
  }

  saveComment = editorState => {
    const { comment } = this.props
    const contentState = editorState.getCurrentContent()
    if ((!contentState.hasText() || isEmpty(contentState.getPlainText().trim())) && isEmpty(comment.attachments)) {
      // Don't accept empty comments.
      return
    }

    this.setState({ editing: false })
    this.props.updateComment(contentStateToHTML(editorState.getCurrentContent()))
  }

  render () {
    const { comment, slug, isCreator, createComment, deleteComment, removeComment } = this.props
    const { editing, replying } = this.state
    const { id, creator, createdAt, text, attachments } = comment
    const profileUrl = personUrl(creator.id, slug)

    const dropdownItems = filter(item => isFunction(item.onClick), [
      {},
      { icon: 'Edit', label: 'Edit', onClick: isCreator && this.editComment },
      { icon: 'Trash', label: 'Delete', onClick: deleteComment },
      { icon: 'Trash', label: 'Remove', onClick: removeComment }
    ])

    const presentedText = present(sanitize(text), { slug })

    return <div styleName='comment'>
      <div styleName='header'>
        <Avatar avatarUrl={creator.avatarUrl} url={profileUrl} styleName='avatar' />
        <Link to={profileUrl} styleName='userName'>{creator.name}</Link>
        <span styleName='timestamp'>
          {editing && 'Editing now'}
          {!editing && humanDate(createdAt)}
        </span>
        <div styleName='upperRight'>
          <div styleName='commentAction' onClick={this.toggleReplyComment} data-tip='Reply' data-for={`reply-tip-${id}`}>
            <Icon name='Replies' />
          </div>
          {dropdownItems.length > 0 && <Dropdown styleName='dropdown' toggleChildren={<Icon name='More' />} items={dropdownItems} />}
        </div>
      </div>
      <CardImageAttachments attachments={attachments} linked styleName='images' />
      <CardFileAttachments attachments={attachments} styleName='files' />
      <ClickCatcher>
        {editing && <HyloEditor
          styleName='editor'
          onChange={this.startTyping}
          contentHTML={text}
          parentComponent={'CommentForm'}
          submitOnReturnHandler={this.saveComment} />}
        {!editing && <div id='text' styleName='text' dangerouslySetInnerHTML={{ __html: presentedText }} />}
      </ClickCatcher>
      {replying && <div styleName='reply'>
        <CommentForm createComment={createComment} placeholder={`Reply to ${creator.name}`} />
      </div>}
      <ReactTooltip
        id={`reply-tip-${id}`}
        effect='solid'
        style='light'
        border
        // :TODO: de-duplicate these colour values
        textColor='#2A4059'
        borderColor='#40A1DD'
        backgroundColor='white'
        offset={{ 'top': -2 }}
        delayShow={500}
        styleName='actionsTooltip' />
    </div>
  }
}
