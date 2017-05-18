import React from 'react'
const { func } = React.PropTypes

export default class SocketSubscriber extends React.Component {
  static propTypes = {
    subscribe: func,
    unsubscribe: func
  }

  setup () {
    // see the connector to understand why this is called "reconnectHandler"
    this.reconnectHandler = this.props.subscribe()
  }

  teardown () {
    this.props.unsubscribe(this.reconnectHandler)
  }

  componentDidMount () {
    this.setup()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.id !== nextProps.id) this.teardown()
  }

  componentDidUpdate (prevProps) {
    if (this.props.id && this.props.id !== prevProps.id) {
      this.setup()
    }
  }

  componentWillUnmount () {
    this.teardown()
  }

  render () {
    return null
  }
}
