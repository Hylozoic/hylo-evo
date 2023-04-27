import cx from 'classnames'
import { find, sortBy } from 'lodash/fp'
import React from 'react'
import { useTranslation } from 'react-i18next'

import RoundImageRow from 'components/RoundImageRow'

import './PeopleInfo.scss'

export default function PeopleInfo ({
  className,
  constrained,
  people,
  peopleTotal,
  excludePersonId,
  phrases,
  onClick,
  small,
  tiny
}) {
  const { t } = useTranslation()

  const defaultPhrases = {
    emptyMessage: t('Be the first to comment'),
    phraseSingular: t('commented'),
    mePhraseSingular: t('commented'),
    pluralPhrase: t('commented')
  }

  const mergedPhrases = { ...defaultPhrases, ...phrases }

  const currentUserIsMember = find(c => c.id === excludePersonId, people)
  const sortedPeople = currentUserIsMember && people.length === 2
    ? sortBy(c => c.id !== excludePersonId, people) // me first
    : sortBy(c => c.id === excludePersonId, people) // me last
  const firstName = person => person.id === excludePersonId ? t('You') : person.name.split(' ')[0]
  const {
    emptyMessage,
    phraseSingular,
    mePhraseSingular,
    pluralPhrase
  } = mergedPhrases
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
      names = t('{{personOne}} and {{personTwo}}', { personOne: firstName(sortedPeople[0]), personTwo: firstName(sortedPeople[1]) })
    } else {
      names = `${firstName(sortedPeople[0])}, ${firstName(sortedPeople[1])} and ${peopleTotal - 2} other${peopleTotal - 2 > 1 ? 's' : ''}`// TODO: Handle this translation i18n
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
