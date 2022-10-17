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
import PeopleInfo from 'components/PostCard/PeopleInfo'
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

    const numAttachments = event.attachments.length || 0
    const firstAttachment = numAttachments ? event.attachments[0] || 0 : null
    const attachmentType = firstAttachment ? firstAttachment.type || 0 : null

    const eventAttendees = filter(ei => ei.response === RESPONSES.YES, eventInvitations)

    return <div styleName={cx('body', 'eventBody', { smallMargin: !expanded, eventImage: attachmentType === 'image' }, { constrained })} className={className}>

      <div styleName='eventTop'>
        <div styleName='calendarDate'>
          <EventDate {...event} />
        </div>
        {currentUser && <div styleName='eventResponseTop'>
          <div styleName='rsvp'>
            <EventRSVP {...event} respondToEvent={respondToEvent} />
          </div>
          <Button label='Invite' onClick={this.toggleInviteDialog} narrow small color='green-white' styleName='inviteButton' />
        </div>}
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

      <div styleName='eventAttendance'>
        <div styleName='people'>
          <div styleName='fade' />
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
        </div>

        {currentUser && <div styleName='eventResponse'>
          <div styleName='rsvp'>
            <EventRSVP {...event} respondToEvent={respondToEvent} />
          </div>
          <Button label='Invite' onClick={this.toggleInviteDialog} narrow small color='green-white' styleName='inviteButton' />
        </div>}

      </div>
      {showInviteDialog && <EventInviteDialog
        eventId={id}
        eventInvitations={eventInvitations}
        forGroups={groups}
        onClose={this.toggleInviteDialog} />}
    </div>
  }
}
