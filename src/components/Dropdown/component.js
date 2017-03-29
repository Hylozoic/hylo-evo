import React from 'react'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import { position } from 'util/scrolling'
import Icon from 'components/Icon'
const { array, object, string, bool } = React.PropTypes
import './component.scss'

export default class Dropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {neverOpened: true}
  }

  static propTypes = {
    children: array,
    className: string,
    triangle: bool,
    toggleChildren: object.isRequired
  }

  toggle = (event, context) => {
    this.setState({active: !this.state.active})
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  hide = () => {
    if (this.state.active) this.setState({active: false})
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

  render () {
    const {
      toggleChildren, items, className, triangle, alignRight
    } = this.props
    const active = this.state.active && !isEmpty(items)
    const styleName = cx('dropdown', {'has-triangle': triangle})

    let children = items.map(item => <li styleName={item.onClick ? 'linkItem' : 'headerItem'}
      onClick={item.onClick} key={item.label}>
      {item.icon && <Icon styleName='icon' name={item.icon} />}
      {item.label}
    </li>)

    if (triangle) {
      const triangleLi = <li styleName='triangle' key='triangle'
        style={{left: findTriangleLeftPos(this.refs.parent)}} />
      children = [triangleLi].concat(children)
    }

    return <div className={className} styleName={styleName} ref='parent'
      onKeyDown={this.handleKeys}>
      <a styleName='dropdown-toggle' onClick={this.toggle}>
        {toggleChildren}
      </a>
      <div styleName='wrapper'>
        <ul styleName={cx('dropdown-menu', {active, alignRight})}
          onClick={() => this.toggle()}>
          {active && children}
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
