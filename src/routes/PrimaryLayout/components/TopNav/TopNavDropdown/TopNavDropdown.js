import React, { PropTypes, Component } from 'react'
import './TopNavDropdown.scss'
const { object, string } = PropTypes
import cx from 'classnames'
import { position } from 'util/scrolling'
import { isEmpty } from 'lodash/fp'

const DROPDOWN_WIDTH = 375

export default class TopNavDropdown extends Component {
  static propTypes = {
    toggleChildren: object,
    className: string,
    header: object,
    items: object
  }

  constructor (props) {
    super(props)
    this.state = {active: true}
  }

  toggle = (newState) => {
    this.setState({active: newState || !this.state.active})
  }

  render () {
    const { toggleChildren, className, topNavPosition, header, body } = this.props
    const { active } = this.state

    console.log('topNavPosition', topNavPosition)

    if (isEmpty(topNavPosition)) return null

    const wrapperStyle = {
      top: `${topNavPosition.height + 24}px`,
      left: `${topNavPosition.rightX - (DROPDOWN_WIDTH + 15)}px`
    }

    const toggleX = position(this.refs.toggle).x

    const triangleStyle = {
      left: `${toggleX - 880}px`
    }

    return <div className={className} styleName='top-nav-dropdown'>
      {active && <div styleName='backdrop' onClick={() => this.toggle(false)} />}
      <a onClick={this.toggle} ref='toggle'>
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
