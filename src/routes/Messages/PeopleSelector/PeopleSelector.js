import PropTypes from 'prop-types'
import React from 'react'
import { debounce, throttle } from 'lodash/fp'
import { getKeyCode, keyMap } from 'util/textInput'
import CloseMessages from '../CloseMessages'
import PeopleSelectorMatches from './PeopleSelectorMatches'
import PeopleSelectorContacts from './PeopleSelectorContacts'
import SelectorMatchedItem from './SelectorMatchedItem'
import './PeopleSelector.scss'

const invalidPersonName = /[^a-z '-]+/gi

export default class PeopleSelector extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      currentMatch: null
    }
    this.autocompleteInput = React.createRef()
  }

  componentDidMount () {
    // TODO: Is there a better way to handle empty functions coming-back from Apollo
    this.props.fetchDefaultList && this.props.fetchDefaultList()
  }

  componentWillReceiveProps (props) {
    const { matches } = props
    if (!matches || matches.length === 0) {
      this.setCurrentMatch()
      return
    }

    if (matches.find(m => this.state.currentMatch && m.id === this.state.currentMatch.id)) return
    this.setState({ currentMatch: matches[0] })
  }

  addParticipant = (participant) => {
    this.autocompleteInput.current.focus()
    if (this.props.participants.find(p => p.id === participant.id)) return
    this.props.setContactsSearch(null)
    this.setCurrentMatch()
    this.autocompleteInput.current.value = null
    this.props.addParticipant(participant)
  }

  removeParticipant = (participant) => {
    this.props.removeParticipant(participant)
  }

  excludeParticipantsAndCurrentUser = (contactList) => {
    if (!contactList) return
    const { currentUser, participants } = this.props
    const participantsIds = participants.map(p => p.id)
    return contactList
      .filter(c => currentUser ? c.id !== currentUser.id : true)
      .filter(c => !participantsIds.includes(c.id))
  }

  arrow (direction, event) {
    event.preventDefault()
    let delta = 0
    const idx = this.props.matches.findIndex(m => m.id === this.state.currentMatch.id)
    if (direction === 'up') {
      if (idx > 0) delta = -1
    }
    if (direction === 'down') {
      if (idx < this.props.matches.length - 1) delta = 1
    }
    this.setCurrentMatch(this.props.matches[idx + delta])
  }

  autocompleteSearch = throttle(1000, this.props.fetchPeople)

  onChange = debounce(200, () => {
    const { value } = this.autocompleteInput.current
    if (!invalidPersonName.exec(value)) {
      return this.props.setContactsSearch(value)
    }
    this.autocompleteInput.current.value = value.replace(invalidPersonName, '')
  })

  onKeyDown (evt) {
    switch (getKeyCode(evt)) {
      case keyMap.BACKSPACE: return this.state.currentMatch ? null : this.removeParticipant()
      case keyMap.UP: return this.arrow('up', evt)
      case keyMap.DOWN: return this.arrow('down', evt)
      case keyMap.COMMA:
      case keyMap.ENTER:
        evt.preventDefault()
        this.addParticipant(this.state.currentMatch)
        this.autocompleteInput.current.value = null
        return this.props.setContactsSearch(null)

      default:
        this.autocompleteSearch(this.autocompleteInput.current.value)
    }
  }

  setCurrentMatch = person => this.setState(() => ({ currentMatch: person }))

  render () {
    const {
      contacts,
      recentContacts,
      matches,
      onCloseURL,
      participants
    } = this.props
    const {
      currentMatch
    } = this.state

    return <React.Fragment>
      <div styleName='thread-header' tabIndex='0'>
        <div styleName='autocomplete-control'>
          {participants && participants.map(participant =>
            <SelectorMatchedItem
              avatarUrl={participant.avatarUrl}
              key={participant.id}
              name={participant.name}
              removeParticipant={() => this.removeParticipant(participant)} />
          )}
          <input styleName='autocomplete'
            autoFocus
            ref={this.autocompleteInput}
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
          matches={this.excludeParticipantsAndCurrentUser(matches)}
          setCurrentMatch={this.setCurrentMatch} />
        : <PeopleSelectorContacts
          addParticipant={this.addParticipant}
          contacts={this.excludeParticipantsAndCurrentUser(contacts)}
          recentContacts={this.excludeParticipantsAndCurrentUser(recentContacts)} />}
    </React.Fragment>
  }
}

PeopleSelector.propTypes = {
  addParticipant: PropTypes.func.isRequired,
  contacts: PropTypes.array,
  currentUser: PropTypes.object,
  fetchPeople: PropTypes.func,
  fetchDefaultList: PropTypes.func,
  matches: PropTypes.array,
  onCloseURL: PropTypes.string,
  participants: PropTypes.array,
  recentContacts: PropTypes.array,
  removeParticipant: PropTypes.func,
  setContactsSearch: PropTypes.func
}
