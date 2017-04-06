import React from 'react'
import { each, keys, values } from 'lodash'
import cx from 'classnames'
//import { getSocket } from '../client/websockets'
import { STARTED_TYPING_INTERVAL } from 'components/MessageForm/MessageForm'
const { bool } = React.PropTypes
import './PeopleTyping.scss'

const MS_CLEAR_TYPING = STARTED_TYPING_INTERVAL + 1000

export default class PeopleTyping extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      peopleTyping: {}
    }
  }

  static propTypes = {
    showNames: bool,
    showBorder: bool
  }

  componentDidMount () {
    // this.socket = getSocket()
    // this.socket.on('userTyping', this.userTyping.bind(this))
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
    const { showNames, showBorder } = this.props
    const names = values(this.state.peopleTyping).map(v => v.name)
    return names.length ? <div className={cx('typing', {showBorder})}>
      {names.length === 1 && <div>
        {showNames ? names[0] : 'Someone'} is typing
      </div>}
      {names.length > 1 && <div>Multiple people are typing</div>}
      &nbsp;
      <Chillipsis />
    </div> : null
  }
}

function Chillipsis () {
  return <div className='chillipsis'>
    <div className='dot d1' />
    <div className='dot d2' />
    <div className='dot d3' />
  </div>
}
