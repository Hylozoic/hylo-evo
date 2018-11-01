import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import PostLabel from 'components/PostLabel'
import Highlight from 'components/Highlight'
import FlagContent from 'components/FlagContent'
import Icon from 'components/Icon'
import { personUrl, tagUrl } from 'util/navigation'
import { humanDate } from 'hylo-utils/text'
import './PostHeader.scss'
import { filter, isFunction, isEmpty } from 'lodash'
import cx from 'classnames'

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
      topics,
      close,
      className,
      slug,
      networkSlug,
      editPost,
      canFlag,
      deletePost,
      removePost,
      pinPost,
      highlightProps,
      topicsOnNewline,
      announcement
    } = this.props

    if (!creator) return null

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
      {icon: 'Trash', label: 'Delete', onClick: deletePost, red: true},
      {icon: 'Trash', label: 'Remove From Community', onClick: removePost, red: true}
      // {icon: 'Complete', label: 'Accept and mark complete', onClick: () => console.log('Accept and mark complete')}
    ], item => isFunction(item.onClick))

    return <div styleName='header' className={className}>
      <div styleName='headerMainRow'>
        <Avatar avatarUrl={creator.avatarUrl} url={personUrl(creator.id, slug, networkSlug)} styleName='avatar' />
        <div styleName='headerText'>
          <Highlight {...highlightProps}>
            <Link to={personUrl(creator.id, slug, networkSlug)} styleName='userName'>{creator.name}{creator.tagline && ', '}</Link>
          </Highlight>
          {creator.tagline && <span styleName='userTitle'>{creator.tagline}</span>}
          <div styleName='timestampRow'>
            <span styleName='timestamp'>
              {humanDate(date)}
            </span>
            {announcement && <span styleName='announcementSection'>
              <span styleName='announcementSpacer'>•</span>
              <span data-tip='Announcement' data-for='announcement-tt'>
                <Icon name='Announcement' styleName='announcementIcon' />
              </span>
              <ReactTooltip
                effect={'solid'}
                delayShow={550}
                id='announcement-tt' />
            </span>}
            {!topicsOnNewline && !isEmpty(topics) && <TopicsLine topics={topics} slug={slug} />}
          </div>
        </div>
        <div styleName='upperRight'>
          {pinned && <Icon name='Pin' styleName='pinIcon' />}
          {type && <PostLabel type={type} styleName='label' />}
          {dropdownItems.length > 0 &&
            <Dropdown toggleChildren={<Icon name='More' />} items={dropdownItems} />}
          {close &&
            <a styleName='close' onClick={close}><Icon name='Ex' /></a>}
        </div>
        {flaggingVisible && <FlagContent type='post'
          linkData={linkData}
          onClose={() => this.setState({flaggingVisible: false})} />
        }
      </div>
      {topicsOnNewline && !isEmpty(topics) && <TopicsLine topics={topics} slug={slug} newLine />}
    </div>
  }
}

export function TopicsLine ({ topics, slug, className, newLine }) {
  return <div styleName={cx('topicsLine', {'newLineForTopics': newLine})}>
    {!newLine && <span styleName='spacer'>•</span>}
    {topics.slice(0, 3).map(t =>
      <Link styleName='topic' to={tagUrl(t.name, slug)} key={t.name}>#{t.name}</Link>)}
  </div>
}
