import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
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
import './Comment.scss'

const { object } = PropTypes

export default class Comment extends Component {
  static propTypes = {
    comment: object
  }

  static defaultProps = {
    attachments: []
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
    this.props.updateComment(contentStateToHTML(editorState.getCurrentContent()))
  }

  render () {
    const { comment, slug, isCreator, deleteComment, removeComment } = this.props
    const { editing } = this.state
    const { creator, createdAt, text, attachments } = comment
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
        <div styleName='upperRight'>
          <span styleName='timestamp'>
            {editing && 'Editing now'}
            {!editing && humanDate(createdAt)}
          </span>
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
  }
}
