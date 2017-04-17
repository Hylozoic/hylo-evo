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
    const { comment, slug } = this.props
    const { creator, createdAt, text } = comment

    const presentedText = present(sanitize(text), {slug})

    return <div styleName='comment'>
      <div styleName='header'>
        <Avatar avatarUrl={creator.avatarUrl} url={personUrl(creator)} styleName='avatar' />
        <Link to={personUrl(creator)} styleName='userName'>{creator.name}</Link>
        <span styleName='commented'>commented</span>
        <div styleName='upperRight'>
          <span styleName='timestamp'>
            {humanDate(createdAt)}
          </span>
          <Dropdown styleName='dropdown' toggleChildren={<Icon name='More' />} triangle items={[
            {icon: 'Trash', label: 'Delete', onClick: () => console.log('Delete')}
          ]} />
        </div>
      </div>
      <div id='text' styleName='text' dangerouslySetInnerHTML={{__html: presentedText}} />
      {/* <div styleName='reply'><Icon name='Reply' styleName='icon' />Reply</div> */}
    </div>
  }
}
