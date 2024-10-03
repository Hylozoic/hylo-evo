import cx from 'classnames'
import moment from 'moment-timezone'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { filter, isFunction } from 'lodash/fp'
import { withTranslation } from 'react-i18next'
import { TextHelpers } from 'hylo-shared'
import { personUrl } from 'util/navigation'
import scrollIntoView from 'scroll-into-view-if-needed'
import Avatar from 'components/Avatar'
import ClickCatcher from 'components/ClickCatcher'
import CardFileAttachments from 'components/CardFileAttachments'
import CardImageAttachments from 'components/CardImageAttachments'
import CommentForm from '../CommentForm'
import EmojiRow from 'components/EmojiRow'
import HyloEditor from 'components/HyloEditor'
import HyloHTML from 'components/HyloHTML/HyloHTML'
import Icon from 'components/Icon'
import ShowMore from '../ShowMore'
import Tooltip from 'components/Tooltip'
import styles from './Comment.module.scss'

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

  commentRef = React.createRef()

  editor = React.createRef()

  state = {
    edited: false,
    editing: false,
    editedText: null,
    scrolledToComment: false
  }

  componentDidMount () {
    // If this is the selected comment (e.g. from a notification) scroll to it
    if (this.props.selectedCommentId === this.props.comment.id) {
      setTimeout(this.handleScrollToComment.bind(this), 500)
    }
  }

  handleEditComment = () => {
    this.setState({ editing: false, edited: true })
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

  handleScrollToComment () {
    if (this.commentRef.current) {
      const { bottom, top } = this.commentRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight

      if (bottom < 0 || bottom > viewportHeight || top < 0) { // element is not inside the current viewport
        scrollIntoView(this.commentRef.current, { block: 'center' })
      }

      if (bottom > 0 && bottom <= viewportHeight && top >= 0) { // element is contained in the viewport
        this.setState({ scrolledToComment: true })
      }
    }
  }

  render () {
    const { canModerate, comment, currentUser, deleteComment, onReplyComment, removeComment, slug, selectedCommentId, post, t } = this.props
    const { id, creator, createdAt, editedAt, text, attachments } = comment
    const { editing, edited } = this.state
    const timestamp = t('commented') + ' ' + TextHelpers.humanDate(createdAt)
    const editedTimestamp = (editedAt || edited) ? t('edited') + ' ' + TextHelpers.humanDate(editedAt) : false
    const isCreator = currentUser && (comment.creator.id === currentUser.id)
    const profileUrl = personUrl(creator.id, slug)
    const dropdownItems = filter(item => isFunction(item.onClick), [
      {},
      { icon: 'Edit', label: 'Edit', onClick: isCreator && this.handleEditComment },
      { icon: 'Trash', label: 'Delete', onClick: isCreator ? () => deleteComment(comment.id, t('Are you sure you want to delete this comment')) : null },
      { icon: 'Trash', label: 'Remove', onClick: !isCreator && canModerate ? () => removeComment(comment.id, t('Are you sure you want to remove this comment?')) : null }
    ])

    return (
      <div ref={this.commentRef} className={cx(styles.commentContainer, { [styles.selectedComment]: selectedCommentId === comment.id })}>
        <div className={styles.header}>
          <Avatar avatarUrl={creator.avatarUrl} url={profileUrl} className={styles.avatar} />
          <Link to={profileUrl} className={styles.userName}>{creator.name}</Link>
          <span className={styles.timestamp} data-for={`dateTip-${comment.id}`} data-tip={moment(createdAt).format('llll')}>
            {timestamp}
          </span>
          {(editedTimestamp) && <span className={styles.timestamp} data-for={`dateTip-${comment.id}`} data-tip={moment(editedAt).format('llll')}>
            ({editedTimestamp})
          </span>}
          <div className={styles.upperRight}>
            {editing && (
              <Icon name='Ex' className={styles.cancelIcon} onClick={this.handleEditCancel} />
            )}
            {currentUser && (
              <div className={styles.commentActions}>
                <div className={cx(styles.commentAction)} onClick={onReplyComment} data-tooltip-content='Reply' data-tooltip-id={`reply-tip-${id}`}>
                  <Icon name='Replies' />
                </div>
                {dropdownItems.map(item => (
                  <div key={item.icon} className={styles.commentAction} onClick={item.onClick}>
                    <Icon name={item.icon} />
                  </div>
                ))}
                <EmojiRow
                  className={cx(styles.emojis, styles.hiddenReactions)}
                  comment={comment}
                  currentUser={currentUser}
                  post={post}
                />
              </div>
            )}
          </div>
        </div>
        {attachments &&
          <div>
            <CardImageAttachments attachments={attachments} linked className={styles.images} />
            <CardFileAttachments attachments={attachments} className={styles.files} />
          </div>}
        {editing && (
          <HyloEditor
            className={styles.editing}
            contentHTML={text}
            onEscape={this.handleEditCancel}
            onEnter={this.handleEditSave}
            ref={this.editor}
          />
        )}
        {!editing && (
          <>
            <ClickCatcher groupSlug={slug}>
              <HyloHTML className={styles.text} html={text} />
            </ClickCatcher>
            <EmojiRow
              className={cx(styles.emojis, { [styles.noEmojis]: !comment.commentReactions || comment.commentReactions.length === 0 })}
              comment={comment}
              currentUser={currentUser}
              post={post}
            />
          </>
        )}
      </div>
    )
  }
}

export class CommentWithReplies extends Component {
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
      this.props.onReplyThread(this.replyBox.current)
      this.setState({ triggerReplyAction: false })
    }
  }

  render () {
    const { comment, createComment, fetchChildComments, childCommentsTotal, hasMoreChildComments, t } = this.props
    let { childComments } = comment
    const { replying, showLatestOnly, newCommentsAdded } = this.state

    if (showLatestOnly) {
      childComments = childComments.slice(-1 * (INITIAL_SUBCOMMENTS_DISPLAYED + newCommentsAdded))
    }

    return (
      <div className={styles.comment}>
        <Comment {...this.props} onReplyComment={this.onReplyComment} />
        {childComments && (
          <div className={styles.subreply}>
            <div className={styles.moreWrap}>
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
          <div className={styles.replybox} ref={this.replyBox}>
            <CommentForm
              createComment={c => {
                createComment(c)
                  .then(() => this.setState({ newCommentsAdded: this.state.newCommentsAdded + 1 }))
              }}
              placeholder={`${t('Reply to')} ${comment.creator.name}`}
              editorContent={this.state.prefillEditor}
              focusOnRender
            />
          </div>
        )}
        <Tooltip id={`reply-tip-${comment.id}`} />
        <Tooltip
          delay={550}
          id={`dateTip-${comment.id}`}
          position='left'
        />
      </div>
    )
  }
}

export default withTranslation()(CommentWithReplies)
