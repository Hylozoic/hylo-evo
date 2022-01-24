import PropTypes from 'prop-types'
import React from 'react'
import { debounce, throttle } from 'lodash/fp'
import Icon from 'components/Icon'
import { getKeyCode, keyMap } from 'util/textInput'
import CloseMessages from '../CloseMessages'
import MatchingPeopleList from './MatchingPeopleList'
import PeopleList from './PeopleList'
import MatchingPeopleListItem from './MatchingPeopleListItem'
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
    this.props.fetchDefaultList()
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (props) {
    const { matchingPeople } = props
    if (!matchingPeople || matchingPeople.length === 0) {
      this.setCurrentMatch()
      return
    }

    if (matchingPeople.find(m => this.state.currentMatch && m.id === this.state.currentMatch.id)) return
    this.setState({ currentMatch: matchingPeople[0] })
  }

  setCurrentMatch = (person) => this.setState(() => ({ currentMatch: person }))

  selectPerson = (person) => {
    if (!person) return
    this.autocompleteInput.current.focus()
    if (this.props.selectedPeople.find(p => p.id === person.id)) return
    this.props.setPeopleSearch(null)
    this.setCurrentMatch()
    this.autocompleteInput.current.value = null
    this.props.selectPerson(person)
  }

  removePerson = (person) => {
    this.props.removePerson(person)
  }

  excludeSelectedPeopleAndCurrentUser = (people) => {
    if (!people) return
    const { currentUser, selectedPeople } = this.props
    const selectedPeopleIds = selectedPeople.map(p => p.id)
    return people
      .filter(c => currentUser ? c.id !== currentUser.id : true)
      .filter(c => !selectedPeopleIds.includes(c.id))
  }

  arrow (direction, event) {
    if (this.props.matchingPeople) {
      event.preventDefault()
      let delta = 0
      const idx = this.props.matchingPeople.findIndex(m => m.id === this.state.currentMatch.id)
      if (direction === 'up') {
        if (idx > 0) delta = -1
      }
      if (direction === 'down') {
        if (idx < this.props.matchingPeople.length - 1) delta = 1
      }
      this.setCurrentMatch(this.props.matchingPeople[idx + delta])
    }
  }

  autocompleteSearch = throttle(1000, this.props.fetchPeople)

  onChange = debounce(200, () => {
    const { value } = this.autocompleteInput.current
    if (!invalidPersonName.exec(value)) {
      return this.props.setPeopleSearch(value)
    }
    this.autocompleteInput.current.value = value.replace(invalidPersonName, '')
  })

  onKeyDown (evt) {
    switch (getKeyCode(evt)) {
      case keyMap.BACKSPACE: return this.autocompleteInput.current.value ? null : this.removePerson()
      case keyMap.UP: return this.arrow('up', evt)
      case keyMap.DOWN: return this.arrow('down', evt)
      case keyMap.COMMA:
      case keyMap.ENTER:
        evt.preventDefault()
        this.selectPerson(this.state.currentMatch)
        this.autocompleteInput.current.value = null
        return this.props.setPeopleSearch(null)

      default:
        this.autocompleteSearch(this.autocompleteInput.current.value)
    }
  }

  render () {
    const {
      people,
      recentPeople,
      matchingPeople,
      onCloseURL,
      selectedPeople,
      toggleMessages
    } = this.props
    const {
      currentMatch
    } = this.state

    return <React.Fragment>
      <div styleName='thread-header' tabIndex='0'>
        <div styleName='backButton' onClick={toggleMessages}>
          <Icon name='ArrowDown' styleName='arrow-down' />
        </div>
        <div styleName='autocomplete-control'>
          {selectedPeople && selectedPeople.map(person =>
            <MatchingPeopleListItem
              avatarUrl={person.avatarUrl}
              name={person.name}
              onClick={() => this.removePerson(person)}
              key={person.id} />
          )}
          <input styleName='autocomplete'
            autoFocus
            ref={this.autocompleteInput}
            type='text'
            spellCheck={false}
            onChange={evt => this.onChange(evt)}
            onKeyDown={evt => this.onKeyDown(evt)}
            placeholder={selectedPeople.length ? '' : 'Type in the names of people to message'} />
        </div>
        <CloseMessages onCloseURL={onCloseURL} />
      </div>
      {currentMatch
        ? <MatchingPeopleList
          matchingPeople={this.excludeSelectedPeopleAndCurrentUser(matchingPeople)}
          currentMatch={currentMatch}
          onClick={this.selectPerson}
          onMouseOver={this.setCurrentMatch} />
        : <PeopleList
          people={this.excludeSelectedPeopleAndCurrentUser(people)}
          recentPeople={this.excludeSelectedPeopleAndCurrentUser(recentPeople)}
          onClick={this.selectPerson} />}
    </React.Fragment>
  }
}

PeopleSelector.propTypes = {
  people: PropTypes.array,
  currentUser: PropTypes.object,
  fetchPeople: PropTypes.func,
  fetchDefaultList: PropTypes.func,
  setPeopleSearch: PropTypes.func,
  matchingPeople: PropTypes.array,
  onCloseURL: PropTypes.string,
  selectedPeople: PropTypes.array,
  recentPeople: PropTypes.array,
  selectPerson: PropTypes.func.isRequired,
  removePerson: PropTypes.func
}
