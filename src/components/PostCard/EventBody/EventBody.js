import React, { Component } from 'react'
import Icon from 'components/Icon'
import Button from 'components/Button'
import EventInviteDialog from 'components/EventInviteDialog'
import EventDate from '../EventDate'
import EventRSVP from '../EventRSVP'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import '../PostBody/PostBody.scss'
import cx from 'classnames'
import { formatDatePair } from 'util/index'

export default class EventBody extends Component {
  state = {
    showInviteDialog: false
  }

  toggleInviteDialog = () => this.setState({ showInviteDialog: !this.state.showInviteDialog })

  render () {
    const { event, respondToEvent, slug, expanded, className, constrained } = this.props
    const { showInviteDialog } = this.state
    const { id, startTime, endTime, location, eventInvitations, groups } = event

    return <div styleName={cx('body', 'eventBody', { smallMargin: !expanded }, { constrained })} className={className}>
      <div styleName='calendarDate'>
        <EventDate {...event} />
      </div>
      <div styleName={cx('eventBodyColumn', { constrained })}>
        <PostTitle {...event} constrained={constrained} />
        <div styleName={cx('eventData', { constrained })}>
          <Icon name='Clock' styleName='icon' /> {formatDatePair(startTime, endTime)}
        </div>
        {!!location && <div styleName='eventData eventLocation'>
          <Icon name='Location' styleName='icon' /> {location}
        </div>}
        <div styleName={cx('eventDetails', { constrained })}>
          <PostDetails {...event} slug={slug} hideDetails={!expanded} expanded={expanded} constrained={constrained} />
        </div>
      </div>
      <div styleName='eventRightColumn'>
        <EventRSVP {...event} respondToEvent={respondToEvent} />
        <Button label='Invite' onClick={this.toggleInviteDialog} narrow small color='green-white' styleName='inviteButton' />
      </div>
      {showInviteDialog && <EventInviteDialog
        eventId={id}
        eventInvitations={eventInvitations}
        forGroups={groups}
        onClose={this.toggleInviteDialog} />}
    </div>
  }
}
