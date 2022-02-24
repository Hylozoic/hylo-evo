import PropTypes from 'prop-types'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'
import { filter, isEmpty, isFunction } from 'lodash/fp'
import { humanDate, present, sanitize } from 'hylo-utils/text'
import { personUrl } from 'util/navigation'
import ShowMore from '../ShowMore'
import Tooltip from 'components/Tooltip'
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

  state = {
    editing: false
  }

  editComment = () => {
    this.setState({ editing: true })
  }

  saveComment = editorState => {
    const { comment } = this.props
    const contentState = editorState.getCurrentContent()
    if ((!contentState.hasText() || isEmpty(contentState.getPlainText().trim())) && isEmpty(comment.attachments)) {
      // Don't accept empty comments.
      return
    }

    this.setState({ editing: false })
    this.props.updateComment(comment.id, contentStateToHTML(editorState.getCurrentContent()))
  }

  render () {
    const { canModerate, comment, currentUser, deleteComment, onReplyComment, removeComment, slug } = this.props
    const { id, creator, createdAt, text, attachments } = comment
    const { editing } = this.state
    const isCreator = currentUser && (comment.creator.id === currentUser.id)
    const profileUrl = personUrl(creator.id, slug)
    const presentedText = present(sanitize(text), { slug })

    const dropdownItems = filter(item => isFunction(item.onClick), [
      {},
      { icon: 'Edit', label: 'Edit', onClick: isCreator && this.editComment },
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
            {!editing && humanDate(createdAt)}
          </span>
          <div styleName='upperRight'>
            <div styleName='commentAction' onClick={onReplyComment} data-tip='Reply' data-for={`reply-tip-${id}`}>
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

  replyBox = React.createRef()

  onReplyComment = (e, toMember) => {
    // On any interaction, relevant comment box shows & only leaves
    // naturally once the component is cleared from view.
    this.setState({
      replying: true,
      triggerReplyAction: true,
      prefillEditor: toMember
        ? `<p><a data-entity-type="mention" data-user-id="${toMember.id}">${toMember.name}</a> </p>`
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

    return <div styleName='comment'>
      <Comment {...this.props} onReplyComment={this.onReplyComment} />
      {childComments && childComments && <div styleName='subreply'>
        <div styleName='more-wrap'>
          <ShowMore
            commentsLength={childComments.length}
            total={childCommentsTotal + newCommentsAdded}
            hasMore={hasMoreChildComments}
            fetchComments={() => {
              this.setState({ showLatestOnly: false })
              fetchChildComments()
            }} />
        </div>
        {childComments.map(c =>
          <Comment key={c.id}
            {...this.props}
            comment={c}
            // sets child comments to toggle reply box one level deep, rather than allowing recursion
            onReplyComment={(e) => this.onReplyComment(e, c.creator)}
          />)
        }
      </div>}
      {replying && <div styleName='replybox' ref={this.replyBox}>
        <CommentForm
          createComment={c => {
            createComment(c)
              .then(() => this.setState({ newCommentsAdded: this.state.newCommentsAdded + 1 }))
          }}
          placeholder={`Reply to ${comment.creator.name}`}
          editorContent={this.state.prefillEditor}
          focusOnRender />
      </div>}
      <Tooltip id={`reply-tip-${comment.id}`} />
    </div>
  }
}
