import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { isEmpty, filter, get, map } from 'lodash/fp'
import Icon from 'components/Icon'
import { others } from 'store/models/MessageThread'
import '../Messages.scss'

const MAX_CHARACTERS = 60

export default class Header extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      showAll: false,
      messageThreadId: null
    }
  }

  toggleShowAll = () => {
    const { showAll } = this.state
    this.setState({
      ...this.state,
      showAll: !showAll
    })
  }

  resetStateWithNewId = (messageThreadId) => {
    this.setState({
      showAll: false,
      messageThreadId
    })
  }

  componentWillReceiveProps = () => {
    const messageThreadId = get('id', this.props.messageThread)

    if (this.state.messageThreadId !== messageThreadId) {
      this.resetStateWithNewId(messageThreadId)
    }
  }

  getOthers ({ currentUser, messageThread }) {
    const participants = get('participants', messageThread) || []

    if (!currentUser) return participants

    const id = get('id', currentUser)

    return currentUser && map('name', filter(f => f.id !== id, participants))
  }

  render () {
    const { showAll } = this.state
    const { pending } = this.props
    const otherParticipants = this.getOthers(this.props)
    const maxShown = calculateMaxShown(showAll, otherParticipants, MAX_CHARACTERS)
    const { displayNames, andOthers } = generateDisplayNames(maxShown, otherParticipants)
    const showArrow = !!andOthers

    return <div styleName='header' id='thread-header'>
      <Link to='/messages' styleName='close-thread'>
        <Icon name='ArrowForward' />
      </Link>
      <div styleName='header-text'>
        {!pending && <React.Fragment>
          {displayNames}
          {andOthers && 'and' && <span styleName='toggle-link' onClick={this.toggleShowAll}>{andOthers}</span>}
        </React.Fragment>}
      </div>
      {showArrow && !showAll && <Icon name='ArrowDown' styleName='arrow-down' onClick={this.toggleShowAll} />}
      {showAll && <Icon name='ArrowUp' styleName='arrow-up' onClick={this.toggleShowAll} />}
    </div>
  }
}

Header.propTypes = {
  messageThread: PropTypes.any
}

export function calculateMaxShown (showAll, otherParticipants, maxCharacters) {
  if (showAll) return otherParticipants.length
  if (!otherParticipants) return 0
  let count = 0
  for (let i = 0; i < otherParticipants.length; i++) {
    count += otherParticipants[i].length
    if (count > maxCharacters) {
      return i
    }
  }
  return otherParticipants.length
}

export function generateDisplayNames (maxShown, otherParticipants) {
  return isEmpty(otherParticipants)
    ? { displayNames: 'You' }
    : formatNames([...otherParticipants], maxShown)
}

export function formatNames (otherParticipants, maxShown) {
  let andOthers = null
  const length = otherParticipants.length
  const truncatedNames = (maxShown && maxShown < length)
    ? otherParticipants.slice(0, maxShown).concat([others(length - maxShown)])
    : otherParticipants
  if (maxShown && maxShown !== length) andOthers = truncatedNames.pop()

  if (andOthers) {
    return { displayNames: truncatedNames.join(', '), andOthers: ` ${andOthers}` }
  } else {
    return { displayNames: truncatedNames.join(', ') }
  }
}
