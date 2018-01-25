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

  render () {
    const { showAll } = this.state
    const { others } = this.props
    const maxShown = showAll ? others.length : calculateMaxShown(others, MAX_CHARACTERS)
    const showArrow = others && maxShown !== others.length
    const {displayNames, andOthers} = generateHeaderText(maxShown, others)
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

export function calculateMaxShown (names, maxCharacters) {
  if (!names) return 0
  let count = 0
  for (let i = 0; i < names.length; i++) {
    count += names[i].length
    if (count > maxCharacters) {
      return i
    }
  }
}

export function generateHeaderText (maxShown, others) {
  if (isEmpty(others)) {
    return 'You'
  }
  return isEmpty(others)
    ? 'You'
    : formatNames([...others], maxShown)
}

export function formatNames (names, maxShown) {
  const length = names.length
  let andOthers = null
  const truncatedNames = (maxShown && maxShown < length)
    ? names.slice(0, maxShown).concat([others(length - maxShown)])
    : names

  if (maxShown !== length) andOthers = truncatedNames.pop()

  if (andOthers) {
    return {displayNames: truncatedNames.join(', '), andOthers: ` ${andOthers}`}
  } else {
    return {displayNames: truncatedNames.join(', ')}
  }
}
