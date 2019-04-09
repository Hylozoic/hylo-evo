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

  toggleInviteDialog = () => this.setState({showInviteDialog: !this.state.showInviteDialog})

  render () {
    const { event, respondToEvent, slug, expanded, className } = this.props
    const { showInviteDialog } = this.state
    const { id, startTime, endTime, location, eventInvitations } = event

    return <div styleName={cx('body', 'eventBody', {smallMargin: !expanded})} className={className}>
      <EventDate {...event} />
      <div styleName='eventBodyColumn'>
        <PostTitle {...event} />
        <div styleName='eventData'>
          <Icon name='Clock' styleName='icon' /> {formatDatePair(startTime, endTime)}
        </div>
        {!!location && <div styleName='eventData eventLocation'>
          <Icon name='Location' styleName='icon' /> {location}
        </div>}
        <PostDetails {...event} slug={slug} hideDetails={!expanded} expanded={expanded} />
      </div>
      <div styleName='eventRightColumn'>
        <EventRSVP {...event} respondToEvent={respondToEvent} />
        <Button label='Invite' onClick={this.toggleInviteDialog} narrow small color='gray' styleName='inviteButton' />
      </div>
      {showInviteDialog && <EventInviteDialog
        eventId={id}
        eventInvitations={eventInvitations}
        onClose={this.toggleInviteDialog} />}
    </div>
  }
}
