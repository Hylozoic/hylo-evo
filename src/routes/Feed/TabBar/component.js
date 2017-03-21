import React from 'react'
import Dropdown from 'components/Dropdown'
import { capitalize, sortBy, throttle } from 'lodash/fp'
import { viewportTop, position } from 'util/scrolling'

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

  topNavHeight () {
    return 24
  }

  handleScrollEvents = throttle(50, event => {
    event.preventDefault()
    console.log('scrolling')
    if (this.state.isStatic) {
      console.log('is static')
      if (viewportTop() + this.topNavHeight() > this.startingY) {
        console.log('no more')
        this.setState({isStatic: false})
      }
    } else {
      console.log('is static')
      if (viewportTop() + this.topNavHeight() < this.startingY) {
        console.log('now it is')
        this.setState({isStatic: true})
      }
    }
  })

  componentDidMount () {
    this.startingY = position(this.refs.placeholder).y - 5
    this.setState({isStatic: viewportTop() + this.topNavHeight() < this.startingY})
    window.addEventListener('scroll', this.handleScrollEvents)
  }

  render () {
    const { tabName, sortOption, onChange, className } = this.props

    return <div styleName='tabBar' className={className}>
      {tabNames.map(name => <span
        key={name}
        styleName={name === tabName ? 'tab-active' : 'tab'}
        onClick={() => onChange({tab: name})}>
        {capitalize(name)}
      </span>)}
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
  }
}
