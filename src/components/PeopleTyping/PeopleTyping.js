import React from 'react'
import { each, keys, values } from 'lodash'
import { getSocket } from 'client/websockets'
import { STARTED_TYPING_INTERVAL } from 'components/MessageForm/MessageForm'
import './PeopleTyping.scss'
const { string } = React.PropTypes

const MS_CLEAR_TYPING = STARTED_TYPING_INTERVAL + 1000

export default class PeopleTyping extends React.Component {
  static propTypes = {
    className: string
  }

  constructor (props) {
    super(props)
    this.state = {
      peopleTyping: {}
    }
  }

  componentDidMount () {
    this.socket = getSocket()
    this.socket.on('userTyping', this.userTyping.bind(this))
    this.clearTypingInterval = window.setInterval(this.clearTyping.bind(this), 1000)
  }

  componentWillUnmount () {
    if (this.socket) this.socket.off('userTyping')
    window.clearInterval(this.clearTypingInterval)
  }

  clearTyping () {
    let newState = this.state
    const now = Date.now()
    const stale = user => now - user.timestamp > MS_CLEAR_TYPING
    each(keys(newState.peopleTyping), userId => stale(newState.peopleTyping[userId]) && (delete newState.peopleTyping[userId]))
    this.setState(newState)
  }

  userTyping (data) {
    let newState = this.state
    if (data.isTyping) {
      newState.peopleTyping[data.userId] = {
        name: data.userName,
        timestamp: Date.now()
      }
    } else {
      delete newState.peopleTyping[data.userId]
    }
    this.setState(newState)
  }

  render () {
    const { className } = this.props
    const names = values(this.state.peopleTyping).map(v => v.name)
    return names.length ? <div styleName='typing' className={className}>
      {names.length === 1 && <div>
        {names[0]} is typing...
      </div>}
      {names.length > 1 && <div>Multiple people are typing...</div>}
      &nbsp;
    </div> : null
  }
}
