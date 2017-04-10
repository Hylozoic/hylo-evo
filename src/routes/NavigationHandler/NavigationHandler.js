import React, { PropTypes, Component } from 'react'
import './NavigationHandler.scss'
const { func, object } = PropTypes

export default class NavigationHandler extends Component {
  static propTypes = {
    history: object
  }

  static childContextTypes = {
    navigate: func
  }

  getChildContext () {
    const { history } = this.props
    return {
      navigate: to => {
        history.push(to)
      }
    }
  }

  render () {
    const { children } = this.props
    return <span>{children}</span>
  }
}
