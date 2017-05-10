import React, { PropTypes, Component } from 'react'
import './TopNavDropdown.scss'
const { object, array, string, func } = PropTypes
import { Link } from 'react-router-dom'
import { humanDate, textLength, truncate } from 'hylo-utils/text'
import cx from 'classnames'
import { newMessageUrl, messagesUrl } from 'util/index'
import RoundImageRow from 'components/RoundImageRow'

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

  componentDidMount () {
    this.props.fetchThreads()
  }

  toggle = () => {
    this.setState({active: !this.state.active})
  }

  render () {
    const { toggleChildren, threads, className, goToThread, currentUser, topNavPosition } = this.props
    const { active } = this.state

    const wrapperStyle = {
      top: `${topNavPosition.height + 24}px`,
      left: `${topNavPosition.rightX - 390}px`
    }

    return <div className={className} styleName='messages-dropdown'>
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
