import React from 'react'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import { position } from 'util/scrolling'
const { array, object, string, bool } = React.PropTypes

export default class Dropdowna extends React.Component {
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
  }

  render () {
    const {
      toggleChildren, children, className, triangle, alignRight
    } = this.props
    const { hoverOpened } = this.state
    const { isMobile } = this.context
    const active = this.state.active && !isEmpty(children)
    const styleName = cx('dropdown', {'has-triangle': triangle})

    const ulProps = {
      styleName: cx('dropdown-menu', {active, alignRight}),
      onClick: () => this.toggle(),
      onMouseLeave: () => hoverOpened && this.toggle()
    }

    let items
    if (triangle) {
      const triangleLi = <li styleName='triangle' key='triangle'
        style={{left: findTriangleLeftPos(isMobile, this.refs.parent)}} />
      items = [triangleLi].concat(children)
    } else {
      items = children
    }

    return <div {...{styleName, className}} ref='parent'
      onKeyDown={this.handleKeys}>
      <a styleName='dropdown-toggle' onClick={this.toggle}>
        {toggleChildren}
      </a>
      <ul {...ulProps}>
        {active && items}
      </ul>
    </div>
  }
}

const margin = 10

const findTriangleLeftPos = (isMobile, parent) => {
  if (!isMobile || !parent) return
  return position(parent).x + parent.offsetWidth / 2 - margin - 1
}
