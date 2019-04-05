import PropTypes from 'prop-types'
import React from 'react'
import { debounce, throttle } from 'lodash/fp'
import { getKeyCode, keyMap } from 'util/textInput'
import MessageForm from '../MessageForm'
import CloseMessages from '../Thread/CloseMessages'
import PeopleSelectorMatches from './PeopleSelectorMatches'
import PeopleSelectorContacts from './PeopleSelectorContacts'
import SelectorMatchedItem from './SelectorMatchedItem'
import './PeopleSelector.scss'

const { any, arrayOf, func, shape, string } = PropTypes

const personType = shape({
  id: any,
  name: string,
  avatarUrl: string
})

// TODO: This _grossly_ underestimates the problem! See:
// https://www.w3.org/International/questions/qa-personal-names
const invalidPersonName = /[^a-z '-]+/gi

export default class PeopleSelector extends React.Component {
  static propTypes = {
    autocomplete: string,
    fetchPeople: func,
    deleteParticipant: func,
    participants: arrayOf(personType),
    setAutocomplete: func
  }

  constructor (props) {
    super(props)
    this.state = { currentMatch: null }
  }

  componentDidMount () {
    this.props.fetchContacts()
    this.props.fetchRecentContacts()
    const { participantSearch } = this.props
    if (participantSearch) {
      participantSearch.forEach(p => this.props.addParticipant(p))
      this.props.changeQuerystringParam(this.props, 'participants', null)
    }
  }

  componentWillReceiveProps (props) {
    const { matches } = props
    if (!matches || matches.length === 0) {
      this.setState({ currentMatch: null })
      return
    }

    if (matches.find(m => m.id === this.state.currentMatch)) return
    this.setState({ currentMatch: matches[0].id })
  }

  addParticipant = id => {
    this.props.setAutocomplete(null)
    this.setState({ currentMatch: null })
    this.autocomplete.value = null
    this.props.addParticipant(id)
    this.autocomplete.focus()
  }

  arrow (direction, evt) {
    evt.preventDefault()
    let delta = 0
    const idx = this.props.matches.findIndex(m => m.id === this.state.currentMatch)
    if (direction === 'up') {
      if (idx > 0) delta = -1
    }
    if (direction === 'down') {
      if (idx < this.props.matches.length - 1) delta = 1
    }
    this.setCurrentMatch(this.props.matches[idx + delta].id)
  }

  autocompleteSearch = throttle(1000, this.props.fetchPeople)

  onChange = debounce(200, () => {
    const { value } = this.autocomplete
    if (!invalidPersonName.exec(value)) {
      return this.props.setAutocomplete(value)
    }
    this.autocomplete.value = value.replace(invalidPersonName, '')
  })

  onKeyDown (evt) {
    switch (getKeyCode(evt)) {
      case keyMap.BACKSPACE: return this.state.currentMatch ? null : this.props.removeParticipant()
      case keyMap.UP: return this.arrow('up', evt)
      case keyMap.DOWN: return this.arrow('down', evt)
      case keyMap.COMMA:
      case keyMap.ENTER:
        evt.preventDefault()
        this.props.addParticipant(this.state.currentMatch)
        this.autocomplete.value = null
        return this.props.setAutocomplete(null)

      default:
        this.autocompleteSearch(this.autocomplete.value)
    }
  }

  removeParticipant (id) {
    this.props.removeParticipant(id)
    if (!this.autocomplete.value) {
      this.setState({ currentMatch: null })
    }
  }

  setCurrentMatch = id => this.setState({ currentMatch: id })

  render () {
    const {
      contacts, matches, participants,
      removeParticipant, findOrCreateThread, onCloseURL, holochainMode,
      recentContacts
    } = this.props
    const { currentMatch } = this.state
    return <div styleName='people-selector'>
      <div styleName='thread-header' tabIndex='0'>
        <div styleName='autocomplete-control'>
          {participants && participants.map(participant =>
            <SelectorMatchedItem
              avatarUrl={participant.avatarUrl}
              key={participant.id}
              name={participant.name}
              removeParticipant={() => removeParticipant(participant.id)} />
          )}
          <input styleName='autocomplete'
            autoFocus
            ref={i => this.autocomplete = i} // eslint-disable-line no-return-assign
            type='text'
            spellCheck={false}
            onChange={evt => this.onChange(evt)}
            onKeyDown={evt => this.onKeyDown(evt)}
            placeholder={participants.length ? '' : 'Type in the names of people to message'} />
        </div>
        <CloseMessages onCloseURL={onCloseURL} />
      </div>
      {currentMatch
        ? <PeopleSelectorMatches
          addParticipant={this.addParticipant}
          currentMatch={currentMatch}
          matches={matches}
          setCurrentMatch={this.setCurrentMatch} />
        : <PeopleSelectorContacts
          addParticipant={this.addParticipant}
          contacts={contacts}
          recentContacts={recentContacts} />}
      {participants && participants.length > 0 &&
        <div styleName='message-form'>
          <MessageForm ref='form'
            forNewThread
            holochainMode={holochainMode}
            findOrCreateThread={() => findOrCreateThread(participants.map(p => p.id), new Date().getTime().toString())} />
        </div>}
    </div>
  }
}
