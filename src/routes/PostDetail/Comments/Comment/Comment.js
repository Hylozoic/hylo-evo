import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { filter, isFunction } from 'lodash/fp'
import { TextHelpers } from 'hylo-shared'
import { personUrl } from 'util/navigation'
import ShowMore from '../ShowMore'
import Tooltip from 'components/Tooltip'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import ClickCatcher from 'components/ClickCatcher'
import HyloEditor from 'components/HyloEditor'
import CardImageAttachments from 'components/CardImageAttachments'
import CardFileAttachments from 'components/CardFileAttachments'
import CommentForm from '../CommentForm'

import './Comment.scss'

const { object, func } = PropTypes

export const INITIAL_SUBCOMMENTS_DISPLAYED = 4

export class Comment extends Component {
  static propTypes = {
    comment: object.isRequired,
    onReplyComment: func.isRequired,
    updateComment: func,
    deleteComment: func,
    removeComment: func
  }

  editor = React.createRef()

  state = {
    editing: false,
    editedText: null
  }

  handleEditComment = () => {
    this.setState({ editing: true })
  }

  handleEditCancel = () => {
    this.setState({ editedText: null, editing: false })
    this.editor.current.setContent(this.props.comment.text)

    return true
  }

  handleEditSave = contentHTML => {
    const { comment } = this.props

    if (this.editor?.current && this.editor.current.isEmpty()) {
      // Do nothing and stop propagation
      return true
    }

    this.props.updateComment(comment.id, contentHTML)
    this.setState({ editing: false })

    // Tell Editor this keyboard event was handled and to end propagation.
    return true
  }

  render () {
    const { canModerate, comment, currentUser, deleteComment, onReplyComment, removeComment, slug } = this.props
    const { id, creator, createdAt, text, attachments } = comment
    const { editing } = this.state
    const isCreator = currentUser && (comment.creator.id === currentUser.id)
    const profileUrl = personUrl(creator.id, slug)
    const dropdownItems = filter(item => isFunction(item.onClick), [
      {},
      { icon: 'Edit', label: 'Edit', onClick: isCreator && this.handleEditComment },
      { icon: 'Trash', label: 'Delete', onClick: isCreator ? () => deleteComment(comment.id) : null },
      { icon: 'Trash', label: 'Remove', onClick: !isCreator && canModerate ? () => removeComment(comment.id) : null }
    ])

    return (
      <div>
        <div styleName='header'>
          <Avatar avatarUrl={creator.avatarUrl} url={profileUrl} styleName='avatar' />
          <Link to={profileUrl} styleName='userName'>{creator.name}</Link>
          <span styleName='timestamp'>
            {editing && 'Editing now'}
            {!editing && TextHelpers.humanDate(createdAt)}
          </span>
          <div styleName='upperRight'>
            <div styleName='commentAction' onClick={onReplyComment} data-tip='Reply' data-for={`reply-tip-${id}`}>
              <Icon name='Replies' />
            </div>
            {editing && (
              <Icon name='Ex' styleName='cancelIcon' onClick={this.handleEditCancel} />
            )}
            {!editing && dropdownItems.length > 0 && (
              <Dropdown styleName='dropdown' toggleChildren={<Icon name='More' />} items={dropdownItems} />
            )}
          </div>
        </div>
        <CardImageAttachments attachments={attachments} linked styleName='images' />
        <CardFileAttachments attachments={attachments} styleName='files' />
        <ClickCatcher groupSlug={slug}>
          {/* Renders and provides editor */}
          <HyloEditor
            styleName={editing ? 'editing' : 'text'}
            contentHTML={text || ''}
            hideMenu
            readOnly={!editing}
            onEscape={this.handleEditCancel}
            onEnter={this.handleEditSave}
            ref={this.editor}
          />
        </ClickCatcher>
      </div>
    )
  }
}

export default class CommentWithReplies extends Component {
  static propTypes = {
    comment: object.isRequired,
    createComment: func.isRequired, // bound by Comments.connector & Comment.connector
    updateComment: func,
    deleteComment: func,
    removeComment: func,
    onReplyThread: func
  }

  static defaultProps = {
    attachments: []
  }

  state = {
    replying: false,
    triggerReplyAction: false,
    prefillEditor: null,
    showLatestOnly: true, // only show a few comments initially, rather than a whole page
    newCommentsAdded: 0 // tracks number of comments added without a requery, to adjust ShowMore pagination totals
  }

  editor = React.createRef()
  replyBox = React.createRef()

  onReplyComment = (e, toMember) => {
    // On any interaction, relevant comment box shows & only leaves
    // naturally once the component is cleared from view.
    this.setState({
      replying: true,
      triggerReplyAction: true,
      prefillEditor: toMember
        ? `<p>${TextHelpers.mentionHTML(toMember)}&nbsp;</p>`
        : ''
    })
  }

  componentDidUpdate (prevProps, prevState) {
    if (this.props.onReplyThread && !prevState.triggerReplyAction && this.state.triggerReplyAction && this.replyBox.current) {
      this.props.onReplyThread(ReactDOM.findDOMNode(this.replyBox.current))
      this.setState({ triggerReplyAction: false })
    }
  }

  render () {
    const { comment, createComment, fetchChildComments, childCommentsTotal, hasMoreChildComments } = this.props
    let { childComments } = comment
    const { replying, showLatestOnly, newCommentsAdded } = this.state

    if (showLatestOnly) {
      childComments = childComments.slice(-1 * (INITIAL_SUBCOMMENTS_DISPLAYED + newCommentsAdded))
    }

    return (
      <div styleName='comment'>
        <Comment {...this.props} onReplyComment={this.onReplyComment} />
        {childComments && (
          <div styleName='subreply'>
            <div styleName='more-wrap'>
              <ShowMore
                commentsLength={childComments.length}
                total={childCommentsTotal + newCommentsAdded}
                hasMore={hasMoreChildComments}
                fetchComments={() => {
                  this.setState({ showLatestOnly: false })
                  fetchChildComments()
                }}
              />
            </div>
            {childComments.map(c => (
              <Comment
                key={c.id}
                {...this.props}
                comment={c}
                // sets child comments to toggle reply box one level deep, rather than allowing recursion
                onReplyComment={(e) => this.onReplyComment(e, c.creator)}
              />
            ))}
          </div>
        )}
        {replying && (
          <div styleName='replybox' ref={this.replyBox}>
            <CommentForm
              createComment={c => {
                createComment(c)
                  .then(() => this.setState({ newCommentsAdded: this.state.newCommentsAdded + 1 }))
              }}
              placeholder={`Reply to ${comment.creator.name}`}
              editorContent={this.state.prefillEditor}
            />
          </div>
        )}
        <Tooltip id={`reply-tip-${comment.id}`} />
      </div>
    )
  }
}
