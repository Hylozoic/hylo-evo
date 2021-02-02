import { any, arrayOf, func, shape, string } from 'prop-types'
import React from 'react'
import PeopleListItem from '../PeopleListItem'
import './PeopleList.scss'

export default function PeopleList ({ onClick, people, recentPeople }) {
  return <div styleName='people-list-container'>
    {recentPeople && recentPeople.length > 0 &&
      <div>
        <h2 styleName='people-list-header'>Recent</h2>
        <ul styleName='people-list'>
          {recentPeople.map(person =>
            <PeopleListItem
              key={person.id}
              person={person}
              onClick={() => onClick(person)} />)}
        </ul>
      </div>}
    {people && people.length > 0 &&
      <div>
        <h2 styleName='people-list-header'>All Contacts</h2>
        <ul styleName='people-list'>
          {people.map(person =>
            <PeopleListItem
              key={person.id}
              person={person}
              onClick={() => onClick(person)} />)}
        </ul>
      </div>}
  </div>
}

const personType = shape({
  id: any,
  name: string,
  avatarUrl: string,
  group: string
})

PeopleList.propTypes = {
  onClick: func,
  people: arrayOf(personType),
  recentPeople: arrayOf(personType)
}
