import PropTypes from 'prop-types'
import React, { Component } from 'react'
import './TopNavDropdown.scss'
import cx from 'classnames'
import { position } from 'util/scrolling'
import ErrorBoundary from 'components/ErrorBoundary'

const { func, object, string } = PropTypes

export default class TopNavDropdown extends Component {
  static propTypes = {
    toggleChildren: object,
    className: string,
    header: object,
    items: object,
    onToggle: func
  }

  constructor (props) {
    super(props)
    this.state = { active: false, neverOpened: true }
  }

  toggle = newState => {
    const active = newState || !this.state.active
    this.setState({ active })
    if (this.props.onToggle) this.props.onToggle(active)
    if (this.state.neverOpened && active) {
      this.setState({ neverOpened: false })
    }
  }

  render () {
    const { toggleChildren, className, header, body } = this.props
    const { active } = this.state

    const toggleRight = document.documentElement.clientWidth - position(this.refs.toggle).x
    const triangleStyle = { right: toggleRight - 41 }

    return <div className={className}>
      {active && <div styleName='backdrop' onClick={() => this.toggle(false)} />}
      <a onClick={() => this.toggle()} ref='toggle'>
        {toggleChildren}
      </a>
      <div styleName={cx('wrapper', 'animateFadeInDown', { active })}>
        <ul styleName='menu'>
          <li styleName='triangle' style={triangleStyle} />
          <ErrorBoundary>
            <li styleName='header'>
              {header}
            </li>
            {body}
          </ErrorBoundary>
        </ul>
      </div>
    </div>
  }
}
