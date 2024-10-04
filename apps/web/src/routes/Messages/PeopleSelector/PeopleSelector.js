import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { debounce, throttle } from 'lodash/fp'
import { getKeyCode, keyMap } from 'util/textInput'
import PeopleList from './PeopleList'
import MatchingPeopleListItem from './MatchingPeopleListItem'
import classes from './PeopleSelector.module.scss'

const invalidPersonName = /[^a-z '-]+/gi

export default function PeopleSelector (props) {
  const [currentMatch, setCurrentMatch] = useState(null)
  const [currentText, setCurrentText] = useState('')
  const autocompleteInput = useRef(null)
  const { t } = useTranslation()

  const {
    focusMessage,
    people,
    setPeopleSearch,
    selectedPeople,
    peopleSelectorOpen
  } = props

  useEffect(() => {
    props.fetchDefaultList()
  }, [])

  useMemo(() => {
    if (!people || people.length === 0) {
      setCurrentMatch(null)
      return
    }

    if (people.find(m => currentMatch && m.id === currentMatch.id)) return
    setCurrentMatch(people[0])
  }, [people])

  // exclude selected people from people list
  const finalPeopleList = useMemo(() => {
    if (!people) return []
    if (!selectedPeople || selectedPeople.length === 0) return people
    const selectedPeopleIds = selectedPeople.map(p => p.id)
    return people.filter(c => !selectedPeopleIds.includes(c.id))
  }, [people, selectedPeople])

  const selectPerson = (person) => {
    if (!person) return
    autocompleteInput.current.focus()
    if (selectedPeople.find(p => p.id === person.id)) return
    setPeopleSearch(null)
    setCurrentMatch(null)
    setCurrentText('')
    props.selectPerson(person)
  }

  const removePerson = (person) => {
    props.removePerson(person)
  }

  const arrow = (direction, event) => {
    if (people) {
      event.preventDefault()
      let delta = 0
      const idx = finalPeopleList.findIndex(m => currentMatch && m.id === currentMatch.id)
      if (direction === 'up') {
        if (idx > 0) delta = -1
      }
      if (direction === 'down') {
        if (idx < people.length - 1) delta = 1
      }
      setCurrentMatch(finalPeopleList[idx + delta])
    }
  }

  const autocompleteSearch = throttle(1000, props.fetchPeople)
  const updatePeopleSearch = debounce(200, setPeopleSearch)

  const onChange = (e) => {
    const val = e.target.value
    if (!invalidPersonName.exec(val)) {
      setCurrentText(val)
      autocompleteSearch(val)
      return updatePeopleSearch(val)
    }
    setCurrentText(val.replace(invalidPersonName, ''))
  }

  const onKeyDown = (evt) => {
    switch (getKeyCode(evt)) {
      case keyMap.BACKSPACE: return currentText ? null : removePerson()
      case keyMap.UP: return arrow('up', evt)
      case keyMap.DOWN: return arrow('down', evt)
      case keyMap.COMMA:
      case keyMap.ENTER:
        evt.preventDefault()
        currentText ? setCurrentText('') : selectedPeople.length > 0 && focusMessage()
        selectPerson(currentMatch)
        return setPeopleSearch(null)
    }
  }
  return <div className={cx(classes.threadHeader)} tabIndex='0'>
    <div className={classes.autocompleteControl}>
      <span className={classes.to}>{t('With:')}</span>
      {selectedPeople && selectedPeople.map(person =>
        <MatchingPeopleListItem
          avatarUrl={person.avatarUrl}
          name={person.name}
          onClick={() => removePerson(person)}
          key={person.id} />
      )}
      <div className={classes.selectPeople}>
        <input
          className={classes.autocomplete}
          autoFocus
          ref={autocompleteInput}
          type='text'
          spellCheck={false}
          onChange={onChange}
          onKeyDown={onKeyDown}
          placeholder={`+ ${t('Add someone')}`}
          onFocus={props.onFocus}
          value={currentText}
        />

        {peopleSelectorOpen
          ? <PeopleList
            people={finalPeopleList}
            currentMatch={currentMatch}
            onClick={selectPerson}
            onMouseOver={setCurrentMatch}
          />
          : ''
        }
      </div>
    </div>
  </div>
}

PeopleSelector.propTypes = {
  people: PropTypes.array,
  currentUser: PropTypes.object,
  fetchPeople: PropTypes.func,
  fetchDefaultList: PropTypes.func,
  setPeopleSearch: PropTypes.func,
  selectedPeople: PropTypes.array,
  recentPeople: PropTypes.array,
  selectPerson: PropTypes.func.isRequired,
  removePerson: PropTypes.func
}
