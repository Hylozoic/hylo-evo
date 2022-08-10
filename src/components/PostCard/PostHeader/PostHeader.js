import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import ReactTooltip from 'react-tooltip'
import moment from 'moment'
import Avatar from 'components/Avatar'
import Dropdown from 'components/Dropdown'
import PostLabel from 'components/PostLabel'
import Highlight from 'components/Highlight'
import FlagContent from 'components/FlagContent'
import Icon from 'components/Icon'
import { personUrl, topicUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import './PostHeader.scss'
import { filter, isFunction, isEmpty } from 'lodash'
import cx from 'classnames'

export default class PostHeader extends PureComponent {
  static defaultProps = {
    routeParams: {}
  }

  state = {
    flaggingVisible: false
  }

  flagPostFunc = () =>
    this.props.canFlag ? () => { this.setState({ flaggingVisible: true }) } : undefined

  render () {
    const {
      routeParams,
      creator,
      createdAt,
      type,
      id,
      startTime,
      endTime,
      fulfilledAt,
      pinned,
      topics,
      close,
      className,
      constrained,
      currentUser,
      editPost,
      deletePost,
      removePost,
      pinPost,
      highlightProps,
      topicsOnNewline,
      announcement,
      postUrl
    } = this.props

    if (!creator) return null

    const copyLink = () => {
      navigator.clipboard.writeText(`${window.location.protocol}${window.location.host}${postUrl}`)
    }

    const creatorUrl = personUrl(creator.id, routeParams.groupSlug)
    const { flaggingVisible } = this.state
    // Used to generate a link to this post from the backend.
    const flagPostData = {
      slug: routeParams.groupSlug,
      id: id,
      type: 'post'
    }
    const dropdownItems = filter([
      { icon: 'Pin', label: pinned ? 'Unpin' : 'Pin', onClick: pinPost },
      { icon: 'Edit', label: 'Edit', onClick: editPost },
      { icon: 'Copy', label: 'Copy Link', onClick: copyLink },
      { icon: 'Flag', label: 'Flag', onClick: this.flagPostFunc() },
      { icon: 'Trash', label: 'Delete', onClick: deletePost, red: true },
      { icon: 'Trash', label: 'Remove From Group', onClick: removePost, red: true }
    ], item => isFunction(item.onClick))

    const typesWithTimes = ['offer', 'request', 'resource', 'project']
    const canHaveTimes = typesWithTimes.includes(type)

    // If it was completed/fulfilled before it ended, then use that as the end datetime
    let actualEndTime = fulfilledAt && fulfilledAt < endTime ? fulfilledAt : endTime

    const { from, to } = TextHelpers.formatDatePair(startTime, actualEndTime, true)
    const startString = fulfilledAt ? false
      : TextHelpers.isDateInTheFuture(startTime) ? `Starts: ${from}`
        : TextHelpers.isDateInTheFuture(endTime) ? `Started: ${from}`
          : false

    let endString = false
    if (fulfilledAt && fulfilledAt <= endTime) {
      endString = `Completed: ${to}`
    } else {
      endString = endTime !== moment() && TextHelpers.isDateInTheFuture(endTime) ? `Ends: ${to}` : actualEndTime ? `Ended: ${to}` : false
    }

    let timeWindow = ''

    if (startString && endString) {
      timeWindow = `${startString} / ${endString}`
    } else if (endString) {
      timeWindow = endString
    } else if (startString) {
      timeWindow = startString
    }

    return <div styleName={cx('header', { constrained })} className={className}>
      <div styleName='headerMainRow'>
        <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' />
        <div styleName='headerText'>
          <Highlight {...highlightProps}>
            <Link to={creatorUrl} styleName='userName'>{creator.name}{creator.tagline && !constrained && ', '}</Link>
          </Highlight>
          {creator.tagline && !constrained ? <span styleName='userTitle'>{creator.tagline}</span> : ''}
          <div styleName='timestampRow'>
            <span styleName='timestamp'>
              {TextHelpers.humanDate(createdAt)}
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
            {!topicsOnNewline && !isEmpty(topics) && <TopicsLine topics={topics} slug={routeParams.groupSlug} />}
          </div>
        </div>
        <div styleName='upperRight'>
          {pinned && <Icon name='Pin' styleName='pinIcon' />}
          {fulfilledAt && <PostLabel type={'completed'} styleName='label' />}
          {type && <PostLabel type={type} styleName='label' />}
          {dropdownItems.length > 0 &&
            <Dropdown toggleChildren={<Icon name='More' />} items={dropdownItems} alignRight />}
          {close && currentUser &&
            <a styleName='close' onClick={close}><Icon name='Ex' /></a>}
        </div>
        {flaggingVisible && <FlagContent type='post'
          linkData={flagPostData}
          onClose={() => this.setState({ flaggingVisible: false })} />
        }
      </div>
      {topicsOnNewline && !isEmpty(topics) && <TopicsLine topics={topics} slug={routeParams.groupSlug} newLine />}
      {canHaveTimes && <div styleName='timeWindow'>
        {timeWindow}
      </div>}
    </div>
  }
}

export function TopicsLine ({ topics, slug, newLine }) {
  return <div styleName={cx('topicsLine', { 'newLineForTopics': newLine })}>
    {!newLine && <span styleName='spacer'>•</span>}
    {topics.slice(0, 3).map(t =>
      <Link styleName='topic' to={topicUrl(t.name, { groupSlug: slug })} key={t.name}>#{t.name}</Link>)}
  </div>
}
