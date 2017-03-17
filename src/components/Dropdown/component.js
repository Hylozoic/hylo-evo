import React from 'react'
import cx from 'classnames'
import { isEmpty } from 'lodash'
import { VelocityTransitionGroup } from 'velocity-react'
import { position } from 'util/scrolling'
import { findChildLink, dispatchEvent } from 'util/index'
import KeyControlledList from '../KeyControlledList'
const { array, bool, func, object, string, number, oneOfType } = React.PropTypes

const DROPDOWN_OPENED = 'dropdown-opened'

export default class Dropdown extends React.Component {
  constructor (props) {
    super(props)
    this.state = {neverOpened: true}
  }

  static propTypes = {
    children: array,
    id: string,
    className: string,
    alignRight: bool,
    toggleChildren: object.isRequired,
    onFirstOpen: func,
    onOpen: func,
    onClose: func,
    backdrop: bool,
    triangle: bool,
    openOnHover: bool,
    rivalrous: string,
    keyControlled: bool,
    tabIndex: number,
    onChange: func,
    insteadOfOpening: oneOfType([func, bool])
  }

  static defaultProps = {
    tabIndex: 99
  }

  static contextTypes = {
    isMobile: bool
  }

  toggle = (event, context) => {
    const { active, neverOpened } = this.state
    const { onFirstOpen, onOpen, rivalrous } = this.props

    this.setState({active: !active})
    if (active) {
      this.setState({hoverOpened: false})
    } else {
      this.refs.parent.focus()
      if (context === 'hover') {
        this.setState({hoverOpened: true})
      }
      if (neverOpened) {
        this.setState({neverOpened: false})
        if (onFirstOpen) onFirstOpen()
      }
      if (rivalrous) {
        window.dispatchEvent(new window.CustomEvent(DROPDOWN_OPENED, {
          detail: {name: rivalrous}
        }))
      }
      if (onOpen) onOpen()
    }
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }
  }

  hide = () => {
    const { onClose } = this.props
    if (this.state.active) this.setState({active: false})
    if (onClose) onClose()
    return true
  }

  rivalrousHide = event => {
    if (event.detail.name === this.props.rivalrous) {
      return this.hide()
    }
  }

  componentDidMount () {
    window.addEventListener('click', this.hide)
    if (this.props.rivalrous) {
      window.addEventListener(DROPDOWN_OPENED, this.rivalrousHide)
    }
  }

  componentWillUnmount () {
    window.removeEventListener('click', this.hide)
    if (this.props.rivalrous) {
      window.removeEventListener(DROPDOWN_OPENED, this.rivalrousHide)
    }
  }

  handleKeys = event => {
    if (this.state.active && this.refs.list) this.refs.list.handleKeys(event)
  }

  chooseChild = (element, node) => {
    const link = findChildLink(node)
    dispatchEvent(link, 'click')
    if (this.props.onChange) this.props.onChange(link)
  }

  render () {
    const {
      toggleChildren, children, alignRight, backdrop, triangle, openOnHover, id,
      keyControlled, tabIndex, insteadOfOpening
    } = this.props
    const { hoverOpened } = this.state
    const { isMobile } = this.context
    const active = this.state.active && !isEmpty(children)
    const className = cx('dropdown', this.props.className,
      {active, 'has-triangle': triangle})
    const ulProps = {
      className: cx('dropdown-menu', {'dropdown-menu-right': alignRight}),
      style: mobileMenuStyle(isMobile && active, this.refs.parent),
      onClick: () => this.toggle(),
      onMouseLeave: () => hoverOpened && this.toggle()
    }

    let items
    if (triangle) {
      const triangleLi = <li className='triangle' key='triangle'
        style={{left: findTriangleLeftPos(isMobile, this.refs.parent)}} />
      items = [triangleLi].concat(children)
    } else {
      items = children
    }

    return <div {...{id, className, tabIndex}} ref='parent'
      onKeyDown={this.handleKeys}>
      <a className='dropdown-toggle' onClick={insteadOfOpening || this.toggle}
        onMouseEnter={ev => openOnHover && this.toggle(ev, 'hover')}>
        {toggleChildren}
      </a>
      {keyControlled
        ? <KeyControlledList ref='list' {...ulProps} onChange={this.chooseChild}>
          {items}
        </KeyControlledList>
        : <ul {...ulProps}>
          {active && items}
        </ul>
      }
      <VelocityTransitionGroup
        enter={{animation: 'fadeIn', duration: 100}}
        leave={{animation: 'fadeOut', duration: 100}}>
        {(backdrop || isMobile) && active && <a className='backdrop' />}
      </VelocityTransitionGroup>
    </div>
  }
}

const margin = 10

const mobileMenuStyle = (shouldUse, parent) => {
  if (!shouldUse) return {}
  return {
    left: findLeftPos(parent) + margin,
    width: document.documentElement.clientWidth - margin * 2
  }
}

const findLeftPos = parent => parent ? -position(parent).x : null

const findTriangleLeftPos = (isMobile, parent) => {
  if (!isMobile || !parent) return
  return position(parent).x + parent.offsetWidth / 2 - margin - 1
}
