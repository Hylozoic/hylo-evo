import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './Comment.scss'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import ClickCatcher from 'components/ClickCatcher'
import HyloEditor from 'components/HyloEditor'
import { personUrl } from 'util/index'
import { humanDate, present, sanitize } from 'hylo-utils/text'
import { filter, isFunction } from 'lodash'

const { object } = PropTypes

export default class Comment extends Component {
  static propTypes = {
    comment: object
  }

  state = {
    editing: false
  }

  editComment = () => {
    this.setState({editing: true})
  }

  saveComment = text => {
    this.setState({editing: false})
    this.props.updateComment(text)
  }

  render () {
    const { comment, slug, isCreator, deleteComment, removeComment } = this.props
    const { editing } = this.state
    const { creator, createdAt, text, image } = comment
    const profileUrl = personUrl(creator.id, slug)

    const dropdownItems = filter([
      {},
      {icon: 'Edit', label: 'Edit', onClick: isCreator && this.editComment},
      {icon: 'Trash', label: 'Delete', onClick: deleteComment},
      {icon: 'Trash', label: 'Remove', onClick: removeComment}
    ], item => isFunction(item.onClick))

    const presentedText = present(sanitize(text), {slug})

    return <div styleName='comment'>
      <div styleName='header'>
        <Avatar avatarUrl={creator.avatarUrl} url={profileUrl} styleName='avatar' />
        <Link to={profileUrl} styleName='userName'>{creator.name}</Link>
        <div styleName='upperRight'>
          <span styleName='timestamp'>
            {humanDate(createdAt)}
          </span>
          {dropdownItems.length > 0 && <Dropdown styleName='dropdown' toggleChildren={<Icon name='More' />} items={dropdownItems} />}
        </div>
      </div>
      {image && <a styleName='imageLink' href={image.url} target='_blank'>
        <img src={image.url} styleName='image' />
      </a>}
      {!image && <ClickCatcher>
        {editing && <HyloEditor
          styleName='editor'
          onChange={this.startTyping}
          contentHTML={text}
          parentComponent={'CommentForm'}
          submitOnReturnHandler={this.saveComment} />}
        {!editing && <div id='text' styleName='text' dangerouslySetInnerHTML={{__html: presentedText}} />}
        {/* <div styleName='reply'><Icon name='Reply' styleName='icon' />Reply</div> */}
      </ClickCatcher>}
    </div>
  }
}
