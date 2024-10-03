import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import cx from 'classnames'
import { bgImageStyle } from 'util/index'
import ModalDialog from 'components/ModalDialog'
import CheckBox from 'components/CheckBox'
import Button from 'components/Button'
import { humanResponse } from 'store/models/EventInvitation'
import TextInput from 'components/TextInput'
import { useInView } from 'react-cool-inview'
import Loading from 'components/Loading'

import styles from './EventInviteDialog.module.scss'

const pageSize = 30

const EventInviteDialog = ({
  fetchPeople,
  forGroups,
  eventInvitations,
  people,
  eventId,
  onClose,
  invitePeopleToEvent,
  pending
}) => {
  const [invitedIds, setInvitedIds] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [pageFetched, setPageFetched] = useState(0)

  const toggleInvite = id => (invitedIds.includes(id))
    ? setInvitedIds(invitedIds.filter(invitedId => invitedId !== id))
    : setInvitedIds(invitedIds.concat([id]))

  const onSearchChange = ({ target: { value } }) => setSearchTerm(value)
  const { t } = useTranslation()

  useEffect(() => {
    const fetch = () => {
      const forGroupIds = forGroups.map(c => c.id).filter(c => c !== 'public')
      fetchPeople({ autocomplete: searchTerm, groupIds: forGroupIds, first: pageSize, offset: 0 })
      setPageFetched(pageSize)
    }
    fetch()
  }, [searchTerm])

  const { observe } = useInView({
    onEnter: () => {
      const fetch = () => {
        const forGroupIds = forGroups.map(c => c.id).filter(c => c !== 'public')
        fetchPeople({ autocomplete: searchTerm, groupIds: forGroupIds, first: pageSize, offset: pageFetched })
        setPageFetched(pageFetched + pageSize)
      }
      fetch()
    }
  })

  const getFilteredInviteSuggestions = () => {
    return people.filter(person => {
      return !eventInvitations.map(ei => ei.id).includes(person.id) &&
      person.name.toLowerCase().includes(searchTerm.toLowerCase())
    })
  }

  const submit = () => {
    invitePeopleToEvent(eventId, invitedIds)
    onClose()
  }

  const filteredInviteSuggestions = getFilteredInviteSuggestions()

  const inviteButtonLabel = invitedIds.length === 0
    ? t('Select people to invite')
    : invitedIds.length === 1
      ? t('Invite 1 person')
      : t('Invite {{invitedIds.length}} people', { invitedIds })

  return <ModalDialog key='event-invite-dialog'
    closeModal={onClose}
    modalTitle={`Invite`}
    showCancelButton={false}
    showSubmitButton={false}
    style={{ width: '100%', maxWidth: '620px' }}>
    <div className={styles.container}>
      <Search onChange={onSearchChange} />
      <div className={styles.inviteSuggestions}>
        {filteredInviteSuggestions.map((invitee, idx) => <InviteeRow
          key={invitee.id}
          person={invitee}
          ref={idx === filteredInviteSuggestions.length - 10 ? observe : null}
          selected={invitedIds.includes(invitee.id)}
          onClick={() => toggleInvite(invitee.id)}
        />)}
        <div className={cx(styles.row)}>
          <div className={cx(styles.col)} style={{ height: '40px' }}>
            {pending && <div><Loading /></div>}
          </div>
        </div>
      </div>

      <div className={styles.alreadyInvitedLabel}>{t('Already Invited')}</div>
      <div className={styles.alreadyInvited}>
        {eventInvitations.map(eventInvitation =>
          <InviteeRow
            person={eventInvitation}
            showResponse
            key={eventInvitation.id}
          />)}
      </div>
      <Button
        small
        className={styles.inviteButton}
        label={inviteButtonLabel}
        onClick={submit}
        disabled={invitedIds.length === 0} />
    </div>
  </ModalDialog>
}

export const InviteeRow = React.forwardRef((props, ref) => {
  const { person, selected, showResponse, onClick } = props
  const { name, avatarUrl, response } = person
  return <div ref={ref} className={cx(styles.row)} onClick={onClick}>
    <div className={styles.col}>
      <div className={styles.avatar} style={bgImageStyle(avatarUrl)} />
    </div>
    <div className={styles.col}>
      {name}
    </div>
    {!showResponse && <div className={cx(styles.col, styles.check)}>
      <CheckBox checked={selected} noInput />
    </div>}
    {showResponse && response && <div className={cx(styles.col, styles.response)}>
      {humanResponse(response)}
    </div>}
  </div>
})

export function Search ({ onChange }) {
  const { t } = useTranslation()
  return <div className={styles.search}>
    <TextInput theme={styles}
      inputRef={x => x && x.focus()}
      placeholder={t('Search members')}
      onChange={onChange} />
  </div>
}

export default EventInviteDialog
