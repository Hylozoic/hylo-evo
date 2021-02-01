import PropTypes from 'prop-types'
import React from 'react'
const { func } = PropTypes

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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps (nextProps) {
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
