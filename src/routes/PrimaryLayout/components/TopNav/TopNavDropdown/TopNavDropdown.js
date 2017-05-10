import React, { PropTypes, Component } from 'react'
import './TopNavDropdown.scss'
const { object, string } = PropTypes
import cx from 'classnames'

export default class TopNavDropdown extends Component {
  static propTypes = {
    toggleChildren: object,
    className: string,
    header: object,
    items: object
  }

  constructor (props) {
    super(props)
    this.state = {active: false}
  }

  toggle = () => {
    this.setState({active: !this.state.active})
  }

  render () {
    const { toggleChildren, className, topNavPosition, header, body } = this.props
    const { active } = this.state

    const wrapperStyle = {
      top: `${topNavPosition.height + 24}px`,
      left: `${topNavPosition.rightX - 390}px`
    }

    return <div className={className} styleName='top-nav-dropdown'>
      <a onClick={this.toggle}>
        {toggleChildren}
      </a>
      <div styleName={cx('wrapper', {active})} style={wrapperStyle}>
        <ul styleName='menu'>
          <li styleName='triangle' />
          <li styleName='header'>
            {header}
          </li>
          {body}
        </ul>
      </div>
    </div>
  }
}
