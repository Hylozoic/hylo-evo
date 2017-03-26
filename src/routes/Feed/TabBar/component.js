/* eslint-disable no-unused-vars */
import React from 'react'
import Dropdown from 'components/Dropdown'
import { capitalize, sortBy, throttle } from 'lodash/fp'
import { viewportTop, position } from 'util/scrolling'
// import cx from 'classnames'

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
    return 80
  }

  feedScrollTop () {
    const feedElement = document.getElementById(this.props.feedId)
    if (feedElement) {
      return feedElement.scrollTop
    }
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
    const { feedId } = this.props
    this.startingY = position(this.refs.placeholder).y
    this.startingX = position(this.refs.placeholder).x
    this.setState({isStatic: viewportTop() + this.topNavHeight() < this.startingY})
    const feedElement = document.getElementById(feedId)
    if (feedElement) {
      feedElement.addEventListener('scroll', this.handleScrollEvents)
    }
  }

  render () {
    const { tabName, sortOption, onChange, className } = this.props
    const { isStatic, top } = this.state

    const styleName = isStatic ? 'tabBar' : 'tabBar-floating'
    const style = isStatic ? {} : {top: 75}

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
