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
import '../PostBody/PostBody.scss'

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
      <div styleName={cx('body', 'eventBody', { smallMargin: !expanded, eventImage: attachmentType === 'image' }, { constrained }, { isFlagged: isFlagged && !event.clickthrough })} className={className}>

        <div styleName='eventTop'>
          <div styleName='calendarDate' onClick={onClick}>
            <EventDate {...event} />
          </div>
          {currentUser && <div styleName='eventResponseTop'>
            <div styleName='rsvp'>
              <EventRSVP {...event} respondToEvent={respondToEvent} />
            </div>
            <Button label={t('Invite')} onClick={this.toggleInviteDialog} narrow small color='green-white' styleName='inviteButton' />
          </div>}
        </div>

        <div styleName={cx('eventBodyColumn', { constrained })}>
          <PostTitle {...event} constrained={constrained} onClick={onClick} />
          <div styleName={cx('eventData', { constrained })} onClick={onClick}>
            <Icon name='Clock' styleName='icon' /> {TextHelpers.formatDatePair(startTime, endTime)}
          </div>
          {!!location && <div styleName='eventData eventLocation' onClick={onClick}>
            <Icon name='Location' styleName='icon' /> {location}
          </div>}
          <div styleName={cx('eventDetails', { constrained })}>
            <PostDetails
              {...event}
              onClick={onClick}
              constrained={constrained}
              expanded={expanded}
              slug={slug}
            />
          </div>
        </div>

        <div styleName='eventAttendance'>
          <div styleName='people' onClick={onClick}>
            <div styleName='fade' />
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

          {currentUser && <div styleName='eventResponse'>
            <div styleName='rsvp'>
              <EventRSVP {...event} respondToEvent={respondToEvent} />
            </div>
            <Button label={t('Invite')} onClick={this.toggleInviteDialog} narrow small color='green-white' styleName='inviteButton' />
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
