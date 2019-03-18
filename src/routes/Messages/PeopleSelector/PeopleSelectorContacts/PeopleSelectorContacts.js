import PropTypes from 'prop-types'
import React from 'react'
import PersonListItem from '../PersonListItem'
import './PeopleSelectorContacts.scss'
const { any, arrayOf, func, shape, string } = PropTypes

export default function PeopleSelectorContacts ({ addParticipant, contacts, recentContacts }) {
  return <div styleName='people-selector-contacts'>
    {recentContacts && recentContacts.length > 0 &&
      <div>
        <h2 styleName='contacts-header'>Recent</h2>
        <ul styleName='contact-list'>
          {recentContacts.map(contact =>
            <PersonListItem
              key={contact.id}
              person={contact}
              onClick={() => addParticipant(contact.id)} />)}
        </ul>
      </div>}
    {contacts && contacts.length > 0 &&
      <div>
        <h2 styleName='contacts-header'>All Contacts</h2>
        <ul styleName='contact-list'>
          {contacts.map(contact =>
            <PersonListItem
              key={contact.id}
              person={contact}
              onClick={() => addParticipant(contact.id)} />)}
        </ul>
      </div>}
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
  contacts: arrayOf(personType),
  recentContacts: arrayOf(personType)
}
