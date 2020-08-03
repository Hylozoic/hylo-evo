import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { filter, isFunction } from 'lodash'
import { humanDate, present, sanitize } from 'hylo-utils/text'
import { personUrl } from 'util/navigation'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import ClickCatcher from 'components/ClickCatcher'
import HyloEditor from 'components/HyloEditor'
import { FilePreview } from 'components/AttachmentManager/AttachmentManager'
import CardImage from 'components/CardImage'
import './Comment.scss'

const { object } = PropTypes

export default class Comment extends Component {
  static propTypes = {
    comment: object
  }

  state = {
    editing: false
  }

  editComment = () => {
    this.setState({ editing: true })
  }

  saveComment = text => {
    this.setState({ editing: false })
    this.props.updateComment(text)
  }

  render () {
    const { comment, slug, isCreator, deleteComment, removeComment } = this.props
    const { editing } = this.state
    const { id, creator, createdAt, text, attachments } = comment
    const profileUrl = personUrl(creator.id, slug)

    const dropdownItems = filter([
      {},
      { icon: 'Edit', label: 'Edit', onClick: isCreator && this.editComment },
      { icon: 'Trash', label: 'Delete', onClick: deleteComment },
      { icon: 'Trash', label: 'Remove', onClick: removeComment }
    ], item => isFunction(item.onClick))

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
      <CardImage type='comment' id={id} linked />
      {attachments && attachments.map((attachment, i) => {
        if (attachment.type !== 'image') {
          return <FilePreview attachment={attachment} position={i} key={i} />
        }
      })}
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
