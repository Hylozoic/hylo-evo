import React from 'react'
import { isEmpty } from 'lodash/fp'
import Icon from 'components/Icon'
import CloseMessages from '../CloseMessages'
import { others } from 'store/models/MessageThread'
import '../Thread.scss'

const MAX_CHARACTERS = 60

export default class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showAll: false,
      maxShown: 0,
      showArrow: false
    }
  }

  toggleShowAll = () => {
    const { showAll } = this.state
    this.setState({
      ...this.state,
      showAll: !showAll
    })
  }

  componentWillReceiveProps = () => {
    this.setState({showAll: false})
  }

  render () {
    const { showAll } = this.state
    const { otherParticipants } = this.props
    const maxShown = calculateMaxShown(showAll, otherParticipants, MAX_CHARACTERS)
    const { displayNames, andOthers } = generateDisplayNames(maxShown, otherParticipants)
    const showArrow = !!andOthers
    return <div styleName='header' id='thread-header'>
      <div styleName='header-text'>
        {displayNames}
        {andOthers && 'and' && <span styleName='toggle-link' onClick={this.toggleShowAll}>{andOthers}</span>}
      </div>
      {showArrow && !showAll && <Icon name='ArrowDown' styleName='arrow-down' onClick={this.toggleShowAll} />}
      {showAll && <Icon name='ArrowUp' styleName='arrow-up' onClick={this.toggleShowAll} />}
      <CloseMessages />
    </div>
  }
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
    ? {displayNames: 'You'}
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
    return {displayNames: truncatedNames.join(', '), andOthers: ` ${andOthers}`}
  } else {
    return {displayNames: truncatedNames.join(', ')}
  }
}
