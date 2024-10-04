import cx from 'classnames'
import { filter, isFunction } from 'lodash'
import React, { PureComponent } from 'react'
import { withTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import moment from 'moment-timezone'
import { TextHelpers } from 'hylo-shared'
import Avatar from 'components/Avatar'
import BadgeEmoji from 'components/BadgeEmoji'
import Dropdown from 'components/Dropdown'
import PostLabel from 'components/PostLabel'
import Highlight from 'components/Highlight'
import FlagContent from 'components/FlagContent'
import FlagGroupContent from 'components/FlagGroupContent/FlagGroupContent'
import Icon from 'components/Icon'
import Tooltip from 'components/Tooltip'
import PostCompletion from '../PostCompletion'
import { PROPOSAL_STATUS_CASUAL, PROPOSAL_STATUS_COMPLETED } from 'store/models/Post'
import { personUrl, topicUrl } from 'util/navigation'

import classes from './PostHeader.module.scss'

class PostHeader extends PureComponent {
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
      creator,
      detailHasImage,
      createdTimestamp,
      exactCreatedTimestamp,
      expanded,
      group,
      type,
      id,
      isFlagged,
      startTime,
      hasImage,
      endTime,
      fulfilledAt,
      proposalOutcome,
      proposalStatus,
      pinned,
      topics,
      close,
      className,
      constrained,
      editPost,
      deletePost,
      duplicatePost,
      removePost,
      pinPost,
      highlightProps,
      moderationActionsGroupUrl = '',
      announcement,
      fulfillPost,
      unfulfillPost,
      updateProposalOutcome,
      postUrl,
      roles,
      t
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
      { icon: 'Pin', label: pinned ? t('Unpin') : t('Pin'), onClick: pinPost },
      { icon: 'Edit', label: t('Edit'), onClick: editPost },
      { icon: 'CopyLink', label: t('Copy Link'), onClick: copyLink },
      { icon: 'Flag', label: t('Flag'), onClick: this.flagPostFunc() },
      { icon: 'Duplicate', label: t('Duplicate'), onClick: duplicatePost },
      { icon: 'Trash', label: t('Delete'), onClick: deletePost ? () => deletePost(t('Are you sure you want to delete this post?')) : undefined, red: true },
      { icon: 'Trash', label: t('Remove From Group'), onClick: removePost, red: true }
    ], item => isFunction(item.onClick))

    const typesWithTimes = ['offer', 'request', 'resource', 'project', 'proposal']
    const canHaveTimes = typesWithTimes.includes(type)

    const typesWithCompletion = ['offer', 'request', 'resource', 'project', 'proposal']
    const canBeCompleted = typesWithCompletion.includes(type) && (!proposalStatus || proposalStatus === PROPOSAL_STATUS_COMPLETED || proposalStatus === PROPOSAL_STATUS_CASUAL)

    // If it was completed/fulfilled before it ended, then use that as the end datetime
    const actualEndTime = fulfilledAt && fulfilledAt < endTime ? fulfilledAt : endTime

    const { from, to } = TextHelpers.formatDatePair(startTime, actualEndTime, true)
    const startString = fulfilledAt
      ? false
      : TextHelpers.isDateInTheFuture(startTime)
        ? t('Starts: {{from}}', { from })
        : TextHelpers.isDateInTheFuture(endTime)
          ? t('Started: {{from}}', { from })
          : false

    let endString = false
    if (fulfilledAt && fulfilledAt <= endTime) {
      endString = t('Completed: {{endTime}}', { endTime: to })
    } else {
      endString = endTime !== moment() && TextHelpers.isDateInTheFuture(endTime) ? t('Ends: {{endTime}}', { endTime: to }) : actualEndTime ? t('Ended: {{endTime}}', { endTime: to }) : false
    }

    let timeWindow = ''

    if (startString && endString) {
      timeWindow = `${startString} / ${endString}`
    } else if (endString) {
      timeWindow = endString
    } else if (startString) {
      timeWindow = startString
    }

    const showNormal = ((canBeCompleted && canEdit && expanded) && (topics?.length > 0 || (canHaveTimes && timeWindow.length > 0))) || false
    return (
      <div className={cx(classes.header, { [classes.constrained]: constrained, [classes.detailHasImage]: detailHasImage }, className)}>
        <div className={classes.headerMainRow}>
          <div className={classes.headerTopRow}>
            <Avatar avatarUrl={creator.avatarUrl} url={creatorUrl} className={classes.avatar} />
            <div className={classes.headerText}>
              <Highlight {...highlightProps}>
                <Link to={creatorUrl} className={cx(classes.userName)} data-tooltip-content={creator.tagline} data-tooltip-id={`announcement-tt-${id}`}>{creator.name}</Link>
              </Highlight>
              <div className={classes.badgeRow}>
                {roles.map(role => (
                  <BadgeEmoji key={role.id + role.common} expanded {...role} responsibilities={role.responsibilities} id={id} />
                ))}
              </div>
              <div className={classes.timestampRow}>
                <span className={classes.timestamp} data-tooltip-id={`dateTip-${id}`} data-tooltip-content={exactCreatedTimestamp}>
                  {createdTimestamp}
                </span>
                {announcement && (
                  <span className={classes.announcementSection}>
                    <span className={classes.announcementSpacer}>•</span>
                    <span data-tooltip-content='Announcement' data-tooltip-id={`announcement-tt-${id}`}>
                      <Icon name='Announcement' className={classes.announcementIcon} />
                    </span>
                  </span>
                )}
              </div>
            </div>

            <div className={classes.upperRight}>
              {isFlagged && <Link to={moderationActionsGroupUrl} className={classes.notALink}><Icon name='Flag' className={classes.flagIcon} dataTip={t('See why this post was flagged')} data-tooltip-id='flag-tt' /></Link>}
              <Tooltip
                delay={250}
                id='flag-tt'
              />
              {pinned && <Icon name='Pin' className={classes.pinIcon} />}
              {fulfilledAt && <div data-tooltip-content='Completed' data-tooltip-id={`announcement-tt-${id}`}><PostLabel type='completed' className={classes.label} /></div>}
              {type && <PostLabel type={type} className={classes.label} />}
              {dropdownItems.length > 0 &&
                <Dropdown toggleChildren={<Icon name='More' />} items={dropdownItems} alignRight />}
              {close &&
                <a className={cx(classes.close)} onClick={close}><Icon name='Ex' /></a>}
            </div>
          </div>
          {flaggingVisible && !group &&
            <FlagContent
              type='post'
              linkData={flagPostData}
              onClose={() => this.setState({ flaggingVisible: false })}
            />}
          {flaggingVisible && group &&
            <FlagGroupContent
              type='post'
              linkData={flagPostData}
              onClose={() => this.setState({ flaggingVisible: false })}
            />}
        </div>
        <div className={cx(classes.subheader, { [classes.hasImage]: hasImage, [classes.showNormal]: showNormal })}>
          {topics?.length > 0 && <TopicsLine topics={topics} slug={routeParams.groupSlug} />}
          {canHaveTimes && timeWindow.length > 0 && (
            <div className={classes.timeWindow}>
              {timeWindow}
            </div>
          )}
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
        {
          canEdit && expanded && fulfilledAt && type === 'proposal' && (
            <div className={classes.outcomeContainer}>
              <input
                type='text'
                className={classes.outcomeInput}
                placeholder='Summarize the outcome'
                value={proposalOutcome || ''}
                onChange={(value) => updateProposalOutcome(value.target.value)}
                ref={this.titleInputRef}
              />
            </div>
          )
        }

        <Tooltip
          className={classes.tooltip}
          delayShow={0}
          id={`announcement-tt-${id}`}
          position='top'
        />
        <Tooltip
          delay={550}
          id={`dateTip-${id}`}
          position='left'
        />
      </div>
    )
  }
}

export function TopicsLine ({ topics, slug, newLine }) {
  return (
    <div className={cx(classes.topicsLine, { [classes.newLineForTopics]: newLine })}>
      {topics.slice(0, 3).map(t =>
        <Link className={classes.topic} to={topicUrl(t.name, { groupSlug: slug })} key={t.name}>#{t.name}</Link>)}
    </div>
  )
}

export default withTranslation()(PostHeader)
