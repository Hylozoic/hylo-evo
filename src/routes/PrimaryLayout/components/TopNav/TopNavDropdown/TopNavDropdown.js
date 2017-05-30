import React, { PropTypes, Component } from 'react'
import './TopNavDropdown.scss'
const { func, object, string } = PropTypes
import cx from 'classnames'
import { position } from 'util/scrolling'
import { isEmpty } from 'lodash/fp'

const DROPDOWN_WIDTH = 375

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
    const { toggleChildren, className, topNavPosition, header, body } = this.props
    const { active } = this.state

    if (isEmpty(topNavPosition)) return null

    const wrapperStyle = {
      top: `${topNavPosition.height + 24}px`,
      left: `${topNavPosition.rightX - (DROPDOWN_WIDTH + 15)}px`
    }

    const toggleX = position(this.refs.toggle).x

    const triangleStyle = {
      left: `${toggleX - 880}px`
    }

    return <div className={className}>
      {active && <div styleName='backdrop' onClick={() => this.toggle(false)} />}
      <a onClick={() => this.toggle()} ref='toggle'>
        {toggleChildren}
      </a>
      <div styleName={cx('wrapper', {active})} style={wrapperStyle}>
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
