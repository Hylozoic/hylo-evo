import cx from 'classnames'
import { get, filter } from 'lodash/fp'
import React, { Component } from 'react'
import { TextHelpers } from 'hylo-shared'
import Icon from 'components/Icon'
import Button from 'components/Button'
import EventInviteDialog from 'components/EventInviteDialog'
import EventDate from '../EventDate'
import EventRSVP from '../EventRSVP'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import { PeopleInfo } from 'components/PostCard/PostFooter/PostFooter'
import { RESPONSES } from 'store/models/EventInvitation'
import '../PostBody/PostBody.scss'

export default class EventBody extends Component {
  state = {
    showInviteDialog: false
  }

  toggleInviteDialog = () => this.setState({ showInviteDialog: !this.state.showInviteDialog })

  render () {
    const { currentUser, event, respondToEvent, slug, expanded, className, constrained, togglePeopleDialog } = this.props
    const { showInviteDialog } = this.state
    const { id, startTime, endTime, location, eventInvitations, groups } = event

    const eventAttendees = filter(ei => ei.response === RESPONSES.YES, eventInvitations)

    return <div styleName={cx('body', 'eventBody', { smallMargin: !expanded }, { constrained })} className={className}>
      <div styleName='calendarDate'>
        <EventDate {...event} />
      </div>
      <div styleName={cx('eventBodyColumn', { constrained })}>
        <PostTitle {...event} constrained={constrained} />
        <div styleName={cx('eventData', { constrained })}>
          <Icon name='Clock' styleName='icon' /> {TextHelpers.formatDatePair(startTime, endTime)}
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
      <PeopleInfo
        people={eventAttendees}
        peopleTotal={eventAttendees.length}
        excludePersonId={get('id', currentUser)}
        onClick={togglePeopleDialog}
        phrases={{
          emptyMessage: 'No one is attending yet',
          phraseSingular: 'is attending',
          mePhraseSingular: 'are attending',
          pluralPhrase: 'attending'
        }}
      />
      {showInviteDialog && <EventInviteDialog
        eventId={id}
        eventInvitations={eventInvitations}
        forGroups={groups}
        onClose={this.toggleInviteDialog} />}
    </div>
  }
}
