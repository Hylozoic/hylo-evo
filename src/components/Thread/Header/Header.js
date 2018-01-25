import React from 'react'
import { filter, get, map, isEmpty } from 'lodash/fp'
import Icon from 'components/Icon'
import CloseMessages from '../CloseMessages'
import { formatNames } from 'store/models/MessageThread'
import '../Thread.scss'

export default class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {showAll: false}
  }

  toggleShowAll = () => {
    this.setState({
      showAll: !this.state.showAll
    })
  }

  render () {
    const { thread, currentUser } = this.props
    const { showAll } = this.state
    const participants = get('participants', thread) || []
    const id = get('id', currentUser)
    const others = map('name', filter(f => f.id !== id, participants))
    const maxCharacters = 60
    const maxShown = showAll ? undefined : calculateMaxShown(others, maxCharacters)
    const headerText = isEmpty(others)
      ? 'You'
      : formatNames(others, maxShown)
    const showArrow =
      maxShown
        ? maxShown !== others.length
        : false
    return <div styleName='header' id='thread-header'>
      <div styleName='header-text'>
        {headerText}
      </div>
      {showArrow && !showAll && <Icon name='ArrowDown' styleName='arrow-down' onClick={this.toggleShowAll} />}
      {showArrow && showAll && <Icon name='ArrowUp' styleName='arrow-up' onClick={this.toggleShowAll} />}
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
