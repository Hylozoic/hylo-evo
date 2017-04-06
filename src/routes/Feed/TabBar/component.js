/* eslint-disable no-unused-vars */
import React from 'react'
import Dropdown from 'components/Dropdown'
import { capitalize, sortBy, throttle } from 'lodash/fp'
import { viewportTop, position } from 'util/scrolling'
// import cx from 'classnames'
import './component.scss'

export const tabNames = [
  'all', 'discusions', 'activity', 'requests', 'offers'
]

export const sortOptions = [
  'latest', 'popular'
]

export default class TabBar extends React.Component {
  static defaultProps = {
    tabName: 'all',
    sortOption: 'latest',
    onChange: settings => console.log('Tab Bar changed: ', settings)
  }

  constructor (props) {
    super(props)
    this.state = {isStatic: true}
  }

  topNavHeight () {
    return 56
  }

  feedScrollTop () {
    return document.body.scrollTop
  }

  handleScrollEvents = throttle(50, event => {
    const feedScrollTop = this.feedScrollTop()

    if (this.state.isStatic) {
      if (feedScrollTop + this.topNavHeight() > this.startingY) {
        this.setState({isStatic: false})
      }
    } else {
      if (feedScrollTop + this.topNavHeight() < this.startingY) {
        this.setState({isStatic: true})
      }
    }
  })

  componentDidMount () {
    this.startingY = position(this.refs.placeholder).y
    this.startingX = position(this.refs.placeholder).x
    this.setState({isStatic: viewportTop() + this.topNavHeight() < this.startingY})
    document.addEventListener('scroll', this.handleScrollEvents)
  }

  render () {
    const { tabName, sortOption, onChange, className } = this.props
    const { isStatic, top } = this.state

    const styleName = isStatic ? 'tabBar' : 'tabBar-floating'
    const style = isStatic ? {} : {top: this.topNavHeight()}

    return <div ref='placeholder' className={className} styleName='placeholder'>
      <div styleName={styleName} style={style}>
        <div styleName='tabs'>
          {tabNames.map(name => <span
            key={name}
            styleName={name === tabName ? 'tab-active' : 'tab'}
            onClick={() => onChange({tab: name})}>
            {capitalize(name)}
          </span>)}
        </div>
        {/*
        <Dropdown toggleChildren={<span>{capitalize(sortOption)}</span>}>
          {sortBy(s => s === sortOption, sortOptions).map(option => <li
            key={option}
            onClick={() => onChange({sort: option})}>
            {capitalize(option)}
          </li>)}
        </Dropdown>
        */}
      </div>
    </div>
  }
}
