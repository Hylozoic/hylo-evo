import PropTypes from 'prop-types'
import React from 'react'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import { position } from 'util/scrolling'
import Icon from 'components/Icon'
import './Dropdown.scss'
const { array, object, string, bool } = PropTypes

export default class Dropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = { neverOpened: true }
  }

  static propTypes = {
    children: array,
    className: string,
    triangle: bool,
    items: array,
    toggleChildren: object.isRequired
  }

  toggle = (event, context) => {
    this.setState({ active: !this.state.active })
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  hide = () => {
    if (this.state.active) this.setState({ active: false })
    return true
  }

  componentDidMount () {
    window.addEventListener('click', () => {
      this.hide()
    })
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.hide)
  }

  renderMenuItems () {
    const { children, triangle, items } = this.props

    if (!this.state.active || (isEmpty(items) && isEmpty(children))) {
      return null
    }

    let menuItems = children || items.map(item =>
      <li styleName={cx(item.onClick ? 'linkItem' : 'headerItem', { redItem: item.red })}
        onClick={item.onClick} key={item.key || item.label}>
        {item.icon && <Icon styleName='icon' name={item.icon} />}
        {item.label}
      </li>)

    if (triangle) {
      const triangleLi = <li styleName='triangle' key='triangle'
        style={{ left: findTriangleLeftPos(this.refs.parent) }} />
      menuItems = [triangleLi].concat(menuItems)
    }

    return menuItems
  }

  render () {
    const { toggleChildren, className, triangle, alignRight, menuAbove } = this.props
    const { active } = this.state
    const styleName = cx('dropdown', { 'has-triangle': triangle })

    return <div className={className} styleName={styleName} ref='parent'
      onKeyDown={this.handleKeys}>
      <span styleName={cx('dropdown-toggle', { 'toggled': this.state.active })} onClick={this.toggle}>
        {toggleChildren}
      </span>
      <span styleName={cx('close-dropdown', { 'toggled': this.state.active })} onClick={this.toggle}><Icon name='Ex' /></span>
      <div styleName={cx('wrapper', { alignRight, menuAbove })}>
        <ul styleName={cx('dropdown-menu', { active, alignRight })}
          onClick={() => this.toggle()}>
          {this.renderMenuItems()}
        </ul>
      </div>
    </div>
  }
}

const margin = 10

const findTriangleLeftPos = parent => {
  if (!parent) return
  return position(parent).x + parent.offsetWidth - margin - 1
}
