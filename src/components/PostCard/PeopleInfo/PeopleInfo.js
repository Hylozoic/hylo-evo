import cx from 'classnames'
import { find, sortBy } from 'lodash/fp'
import React from 'react'

import RoundImageRow from 'components/RoundImageRow'

import './PeopleInfo.scss'

export default function PeopleInfo ({
  className,
  constrained,
  people,
  peopleTotal,
  excludePersonId,
  phrases = {
    emptyMessage: 'Be the first to comment',
    phraseSingular: 'commented',
    mePhraseSingular: 'commented',
    pluralPhrase: 'commented'
  },
  onClick,
  small,
  tiny
}) {
  const currentUserIsMember = find(c => c.id === excludePersonId, people)
  const sortedPeople = currentUserIsMember && people.length === 2
    ? sortBy(c => c.id !== excludePersonId, people) // me first
    : sortBy(c => c.id === excludePersonId, people) // me last
  const firstName = person => person.id === excludePersonId ? 'You' : person.name.split(' ')[0]
  const {
    emptyMessage,
    phraseSingular,
    mePhraseSingular,
    pluralPhrase
  } = phrases
  let names = ''
  let phrase = pluralPhrase

  let caption, avatarUrls
  if (sortedPeople.length === 0) {
    caption = emptyMessage
    avatarUrls = []
  } else {
    if (sortedPeople.length === 1) {
      phrase = currentUserIsMember ? mePhraseSingular : phraseSingular
      names = firstName(sortedPeople[0])
    } else if (sortedPeople.length === 2) {
      names = `${firstName(sortedPeople[0])} and ${firstName(sortedPeople[1])}`
    } else {
      names = `${firstName(sortedPeople[0])}, ${firstName(sortedPeople[1])} and ${peopleTotal - 2} other${peopleTotal - 2 > 1 ? 's' : ''}`
    }
    caption = `${names} ${phrase}`
    avatarUrls = people.map(p => p.avatarUrl)
  }
  return (
    <span styleName={cx('people-container', { constrained })} className={className}>
      <RoundImageRow imageUrls={avatarUrls.slice(0, 3)} styleName='people' onClick={onClick} small={small} tiny={tiny} />
      <span styleName='caption' onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'inherit' }}>
        {caption}
      </span>
    </span>
  )
}
