import React, { PropTypes, Component } from 'react'
import './Comment.scss'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import { personUrl } from 'util/index'
import { humanDate, present, sanitize } from 'hylo-utils/text'
const { object } = PropTypes

export default class Comment extends Component {
  static propTypes = {
    comment: object
  }

  render () {
    const { comment, slug, deleteComment } = this.props
    const { creator, createdAt, text } = comment
    const profileUrl = personUrl(creator.id, slug)

    const presentedText = present(sanitize(text), {slug})

    return <div styleName='comment'>
      <div styleName='header'>
        <Avatar avatarUrl={creator.avatarUrl} url={profileUrl} styleName='avatar' />
        <Link to={profileUrl} styleName='userName'>{creator.name}</Link>
        <div styleName='upperRight'>
          <span styleName='timestamp'>
            {humanDate(createdAt)}
          </span>
          {deleteComment && <Dropdown styleName='dropdown' toggleChildren={<Icon name='More' />} items={[
            {icon: 'Trash', label: 'Delete', onClick: deleteComment}
          ]} />}
        </div>
      </div>
      <div id='text' styleName='text' dangerouslySetInnerHTML={{__html: presentedText}} />
      {/* <div styleName='reply'><Icon name='Reply' styleName='icon' />Reply</div> */}
    </div>
  }
}
