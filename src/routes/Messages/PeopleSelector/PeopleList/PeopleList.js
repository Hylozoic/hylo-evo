import { any, arrayOf, func, object, shape, string } from 'prop-types'
import React from 'react'
import PeopleListItem from '../PeopleListItem'
import classes from './PeopleList.module.scss'

export default function PeopleList ({ currentMatch, onClick, onMouseOver, people }) {
  return <div className={classes.peopleListContainer}>
    {people && people.length > 0 &&
      <ul className={classes.peopleList}>
        {people.map(person =>
          <PeopleListItem
            key={person.id}
            active={currentMatch && person.id === currentMatch.id}
            person={person}
            onClick={() => onClick(person)}
            onMouseOver={() => onMouseOver(person)} />)}
      </ul>
    }
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
  onMouseOver: func.isRequired,
  currentMatch: object,
  people: arrayOf(personType)
}
