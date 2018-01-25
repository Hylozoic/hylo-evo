import React from 'react'
import { filter, get, map, isEmpty } from 'lodash/fp'
import CloseMessages from '../CloseMessages'
import { formatNames } from 'store/models/MessageThread'
import '../Thread.scss'

export default class Header extends React.Component {
  render () {
    const { thread, currentUser, showAll } = this.props
    const participants = get('participants', thread) || []
    const id = get('id', currentUser)
    const others = map('name', filter(f => f.id !== id, participants))
    const maxCharacters = 60
    const maxShown = showAll ? undefined : calculateMaxShown(others, maxCharacters)
    const headerText = isEmpty(others)
      ? 'You'
      : formatNames(others, maxShown)

    return <div styleName='header' id='thread-header'>
      <div styleName='header-text'>
        {headerText}
      </div>
      <div>show</div>
      <CloseMessages />
    </div>
  }
}

export function calculateMaxShown (names, maxCharacters) {
  let count = 0
  for (let i = 0; i < names.length; i++) {
    count += names[i].length
    if (count > maxCharacters) return i
  }
}
