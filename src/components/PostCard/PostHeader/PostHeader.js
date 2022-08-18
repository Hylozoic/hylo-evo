import cx from 'classnames'
import { filter, isFunction } from 'lodash'
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
import PostCompletion from '../PostCompletion'
import { personUrl, topicUrl } from 'util/navigation'
import { TextHelpers } from 'hylo-shared'
import './PostHeader.scss'

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
      canEdit,
      context,
      creator,
      createdAt,
      detailHasImage,
      expanded,
      type,
      id,
      startTime,
      hasImage,
      endTime,
      fulfilledAt,
      pinned,
      topics,
      close,
      className,
      constrained,
      editPost,
      deletePost,
      removePost,
      pinPost,
      highlightProps,
      announcement,
      fulfillPost,
      unfulfillPost,
      postUrl
    } = this.props

    if (!creator) return null

    const copyLink = () => {
      navigator.clipboard.writeText(`${window.location.protocol}//${window.location.host}${postUrl}`)
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

    const typesWithCompletion = ['offer', 'request', 'resource', 'project']
    const canBeCompleted = typesWithCompletion.includes(type)

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

    const showNormal = ((canBeCompleted && canEdit && expanded) && (topics.length > 0 || (canHaveTimes && timeWindow.length > 0))) || false

    return <div styleName={cx('header', { constrained }, { detailHasImage })} className={className}>
      <div styleName='headerMainRow'>
        <div styleName='headerTopRow'>
          <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} styleName='avatar' />
          <div styleName='headerText'>
            <Highlight {...highlightProps}>
              <Link to={creatorUrl} styleName='userName' data-tip={creator.tagline} data-for='announcement-tt'>{creator.name}</Link>
            </Highlight>
            <div styleName='timestampRow'>
              <span styleName='timestamp'>
                {TextHelpers.humanDate(createdAt)}
              </span>
              {announcement && <span styleName='announcementSection'>
                <span styleName='announcementSpacer'>•</span>
                <span data-tip='Announcement' data-for='announcement-tt'>
                  <Icon name='Announcement' styleName='announcementIcon' />
                </span>
              </span>}
            </div>
          </div>
          <div styleName='upperRight'>
            {pinned && <Icon name='Pin' styleName='pinIcon' />}
            {fulfilledAt && <div data-tip='Completed' data-for='announcement-tt'><PostLabel type={'completed'} styleName='label' /></div>}
            {type && <PostLabel type={type} styleName='label' />}
            {dropdownItems.length > 0 &&
              <Dropdown toggleChildren={<Icon name='More' />} items={dropdownItems} alignRight />}
            {close && context &&
              <a styleName='close' onClick={close}><Icon name='Ex' /></a>}
          </div>
        </div>
        {flaggingVisible && <FlagContent type='post'
          linkData={flagPostData}
          onClose={() => this.setState({ flaggingVisible: false })} />
        }
      </div>
      <div styleName={cx('subheader', { hasImage }, { showNormal })} >
        {topics.length > 0 && <TopicsLine topics={topics} slug={routeParams.groupSlug} />}
        {canHaveTimes && timeWindow.length > 0 && <div styleName='timeWindow'>
          {timeWindow}
        </div>}
      </div>
      {canBeCompleted && canEdit && expanded && (
        <PostCompletion
          type={type}
          startTime={startTime}
          endTime={endTime}
          isFulfilled={!!fulfilledAt}
          fulfillPost={fulfillPost}
          unfulfillPost={unfulfillPost}
        />
      )}

      <ReactTooltip
        backgroundColor={'rgba(35, 65, 91, 1.0)'}
        effect={'solid'}
        delayShow={0}
        id='announcement-tt' />
    </div>
  }
}

export function TopicsLine ({ topics, slug, newLine }) {
  return <div styleName={cx('topicsLine', { 'newLineForTopics': newLine })}>
    {topics.slice(0, 3).map(t =>
      <Link styleName='topic' to={topicUrl(t.name, { groupSlug: slug })} key={t.name}>#{t.name}</Link>)}
  </div>
}
