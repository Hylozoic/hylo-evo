import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import PostLabel from 'components/PostLabel'
import Highlight from 'components/Highlight'
import FlagContent from 'components/FlagContent'
import Icon from 'components/Icon'
import { communityUrl, personUrl } from 'util/index'
import { humanDate } from 'hylo-utils/text'
import './PostHeader.scss'
import { filter, isFunction, isEmpty } from 'lodash'

export default class PostHeader extends PureComponent {
  state = {
    flaggingVisible: false
  }

  static defaultProps = {
    flaggingVisible: false
  }

  render () {
    const {
      creator,
      date,
      type,
      id,
      pinned,
      communities,
      close,
      className,
      slug,
      showCommunity,
      editPost,
      canFlag,
      deletePost,
      removePost,
      pinPost,
      highlightProps } = this.props
    if (!creator) return null

    let context

    if (showCommunity && !isEmpty(communities) && communities[0]) {
      const {name, slug} = communities[0]
      context = {
        label: name,
        url: communityUrl(slug)
      }
    }

    const flagPostFn = canFlag ? () => {
      this.setState({ flaggingVisible: true })
    } : null

    const { flaggingVisible } = this.state

    // Used to generate a link to this post from the backend.
    const linkData = {
      slug,
      id: id,
      type: 'post'
    }

    const dropdownItems = filter([
      // Leaving these here as they will be implemented in the future
      // {icon: 'Flag', label: 'Flag', onClick: () => console.log('Flag')},
      {icon: 'Pin', label: pinned ? 'Unpin' : 'Pin', onClick: pinPost},
      {icon: 'Edit', label: 'Edit', onClick: editPost},
      {icon: 'Flag', label: 'Flag', onClick: flagPostFn},
      {icon: 'Trash', label: 'Delete', onClick: deletePost},
      {icon: 'Trash', label: 'Remove From Community', onClick: removePost}
      // {icon: 'Complete', label: 'Accept and mark complete', onClick: () => console.log('Accept and mark complete')}
    ], item => isFunction(item.onClick))

    return <div styleName='header' className={className}>
      <Avatar avatarUrl={creator.avatarUrl} url={personUrl(creator.id, slug)} styleName='avatar' />
      <div styleName='headerText'>
        <Highlight {...highlightProps}>
          <Link to={personUrl(creator.id, slug)} styleName='userName'>{creator.name}{creator.tagline && ', '}</Link>
        </Highlight>
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
        {pinned && <Icon name='Pin' styleName='pinIcon' />}
        {type && <PostLabel type={type} styleName='label' />}
        {dropdownItems.length > 0 &&
        <Dropdown toggleChildren={<Icon name='More' />} items={dropdownItems} />}
        {close && <a styleName='close' onClick={close}><Icon name='Ex' /></a>}
      </div>
      {flaggingVisible && <FlagContent type='post'
        linkData={linkData}
        onClose={() => this.setState({flaggingVisible: false})} />
      }
    </div>
  }
}
