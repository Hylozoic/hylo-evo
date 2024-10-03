import cx from 'classnames'
import { get, filter } from 'lodash/fp'
import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'
import { TextHelpers } from 'hylo-shared'
import Button from 'components/Button'
import EmojiRow from 'components/EmojiRow'
import EventInviteDialog from 'components/EventInviteDialog'
import EventDate from '../EventDate'
import EventRSVP from '../EventRSVP'
import Icon from 'components/Icon'
import PostTitle from '../PostTitle'
import PostDetails from '../PostDetails'
import PeopleInfo from 'components/PostCard/PeopleInfo'
import { RESPONSES } from 'store/models/EventInvitation'
import classes from '../PostBody/PostBody.module.scss'

class EventBody extends Component {
  state = {
    showInviteDialog: false
  }

  toggleInviteDialog = () => this.setState({ showInviteDialog: !this.state.showInviteDialog })

  render () {
    const { currentUser, event, isFlagged, respondToEvent, slug, expanded, className, constrained, onClick, togglePeopleDialog, t } = this.props
    const { showInviteDialog } = this.state
    const { id, startTime, endTime, location, eventInvitations, groups } = event

    const firstAttachment = event.attachments?.[0]
    const attachmentType = firstAttachment?.type

    const eventAttendees = filter(ei => ei.response === RESPONSES.YES, eventInvitations)

    return (
      <div className={cx(classes.body, classes.eventBody, { [classes.smallMargin]: !expanded, [classes.eventImage]: attachmentType === 'image', [classes.constrained]: constrained, [classes.isFlagged]: isFlagged && !event.clickthrough }, className)}>
        <div className={classes.eventTop}>
          <div className={cx(classes.calendarDate)} onClick={onClick}>
            <EventDate {...event} />
          </div>
          {currentUser && <div className={classes.eventResponseTop}>
            <div className={classes.rsvp}>
              <EventRSVP {...event} respondToEvent={respondToEvent} />
            </div>
            <Button label={t('Invite')} onClick={this.toggleInviteDialog} narrow small color='green-white' className={classes.inviteButton} />
          </div>}
        </div>

        <div className={cx(classes.eventBodyColumn, { [classes.constrained]: constrained })}>
          <PostTitle {...event} constrained={constrained} onClick={onClick} />
          <div className={cx(classes.eventData, { [classes.constrained]: constrained })} onClick={onClick}>
            <Icon name='Clock' className={classes.icon} /> {TextHelpers.formatDatePair(startTime, endTime)}
          </div>
          {!!location && <div className={cx(classes.eventData, classes.eventLocation)} onClick={onClick}>
            <Icon name='Location' className={classes.icon} /> {location}
          </div>}
          <div className={cx(classes.eventDetails, { [classes.constrained]: constrained })}>
            <PostDetails
              {...event}
              onClick={onClick}
              constrained={constrained}
              expanded={expanded}
              slug={slug}
            />
          </div>
        </div>

        <div className={classes.eventAttendance}>
          <div className={classes.people} onClick={onClick}>
            <div className={classes.fade} />
            <PeopleInfo
              people={eventAttendees}
              peopleTotal={eventAttendees.length}
              excludePersonId={get('id', currentUser)}
              onClick={currentUser && togglePeopleDialog}
              phrases={{
                emptyMessage: t('No one is attending yet'),
                phraseSingular: t('is attending'),
                mePhraseSingular: t('are attending'),
                pluralPhrase: t('attending')
              }}
            />
          </div>

          {currentUser && <div className={classes.eventResponse}>
            <div className={classes.rsvp}>
              <EventRSVP {...event} respondToEvent={respondToEvent} />
            </div>
            <Button label={t('Invite')} onClick={this.toggleInviteDialog} narrow small color='green-white' className={classes.inviteButton} />
          </div>}
        </div>
        <EmojiRow
          post={event}
          currentUser={currentUser}
        />
        {showInviteDialog && <EventInviteDialog
          eventId={id}
          eventInvitations={eventInvitations}
          forGroups={groups}
          onClose={this.toggleInviteDialog} />}
      </div>
    )
  }
}
export default withTranslation()(EventBody)
