import React from 'react'
const { any, arrayOf, func, shape, string } = React.PropTypes

import PersonListItem from 'components/PersonListItem'
import './PeopleSelectorContacts.scss'

export default function PeopleSelectorContacts ({ addParticipant, contacts, recentContacts }) {
  return <div styleName='people-selector-contacts'>
    <h2 styleName='contacts-header'>Recent</h2>
    <ul styleName='contact-list'>
      {recentContacts && recentContacts.map(contact =>
        <PersonListItem
          key={contact.id}
          person={contact}
          onClick={() => addParticipant(contact.id)} />)}
    </ul>
    <h2 styleName='contacts-header'>All Contacts</h2>
    <ul styleName='contact-list'>
      {contacts && contacts.map(contact =>
        <PersonListItem
          key={contact.id}
          person={contact}
          onClick={() => addParticipant(contact.id)} />)}
    </ul>
  </div>
}

const personType = shape({
  id: any,
  name: string,
  avatarUrl: string,
  community: string
})

PeopleSelectorContacts.propTypes = {
  addParticipant: func,
  contacts: arrayOf(personType)
}
