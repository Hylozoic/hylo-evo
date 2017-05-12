import React from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import PostLabel from 'components/PostLabel'
import Icon from 'components/Icon'
import { communityUrl, personUrl } from 'util/index'
import { humanDate } from 'hylo-utils/text'
import './PostHeader.scss'

export default function PostHeader ({
  creator,
  date,
  type,
  communities,
  close,
  className,
  slug,
  showCommunity
}) {
  let context

  if (showCommunity) {
    const { name, slug } = communities[0]
    context = {
      label: name,
      url: communityUrl(slug)
    }
  }

  return <div styleName='header' className={className}>
    <Avatar avatarUrl={creator.avatarUrl} url={personUrl(creator.id, slug)} styleName='avatar' />
    <div styleName='headerText'>
      <Link to={personUrl(creator.id, slug)} styleName='userName'>{creator.name}{creator.tagline && ', '}</Link>
      {creator.tagline && <span styleName='userTitle'>{creator.tagline}</span>}
      <div>
        <span styleName='timestamp'>
          {humanDate(date)}{context && <span styleName='spacer'>•</span>}
        </span>
        {context && <Link to={context.url} styleName='context'>
          {context.label}
        </Link>}
      </div>
    </div>
    <div styleName='upperRight'>
      {type && <PostLabel type={type} styleName='label' />}
      <Dropdown toggleChildren={<Icon name='More' />} items={[
        {icon: 'Pin', label: 'Pin', onClick: () => console.log('Pin')},
        {icon: 'Flag', label: 'Flag', onClick: () => console.log('Flag')},
        {icon: 'Trash', label: 'Delete', onClick: () => console.log('Delete')},
        {label: 'Other'},
        {icon: 'Complete', label: 'Accept and mark complete', onClick: () => console.log('Accept and mark complete')}
      ]} />
      {close && <a styleName='close' onClick={close}><Icon name='Ex' /></a>}
    </div>
  </div>
}
