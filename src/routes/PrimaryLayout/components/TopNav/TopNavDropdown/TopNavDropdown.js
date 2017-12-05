import PropTypes from 'prop-types';
import React, { Component } from 'react';
import './TopNavDropdown.scss'
const { func, object, string } = PropTypes
import cx from 'classnames'
import { position } from 'util/scrolling'

export default class TopNavDropdown extends Component {
  static propTypes = {
    toggleChildren: object,
    className: string,
    header: object,
    items: object,
    onToggle: func,
    onFirstOpen: func
  }

  constructor (props) {
    super(props)
    this.state = {active: false, neverOpened: true}
  }

  toggle = newState => {
    const active = newState || !this.state.active
    this.setState({active})
    if (this.props.onToggle) this.props.onToggle(active)
    if (this.state.neverOpened && active) {
      this.setState({neverOpened: false})
      if (this.props.onFirstOpen) this.props.onFirstOpen()
    }
  }

  render () {
    const { toggleChildren, className, header, body } = this.props
    const { active } = this.state

    const toggleRight = document.documentElement.clientWidth - position(this.refs.toggle).x
    const triangleStyle = {right: toggleRight - 41}

    return <div className={className}>
      {active && <div styleName='backdrop' onClick={() => this.toggle(false)} />}
      <a onClick={() => this.toggle()} ref='toggle'>
        {toggleChildren}
      </a>
      <div styleName={cx('wrapper', {active})}>
        <ul styleName='menu'>
          <li styleName='triangle' style={triangleStyle} />
          <li styleName='header'>
            {header}
          </li>
          {body}
        </ul>
      </div>
    </div>
  }
}
