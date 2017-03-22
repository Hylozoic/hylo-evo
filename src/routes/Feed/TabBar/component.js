import React from 'react'
import Dropdown from 'components/Dropdown'
import { capitalize, sortBy, throttle } from 'lodash/fp'
import { viewportTop, position } from 'util/scrolling'
import cx from 'classnames'

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
    event.preventDefault()

    const feedScrollTop = this.feedScrollTop()

    console.log('startingY', this.startingY)
    console.log('feedScrollTop', feedScrollTop)
    console.log('+ topNavHeight', this.topNavHeight())
    console.log('----')
    if (this.state.isStatic) {
      console.log('is static')
      if (feedScrollTop + this.topNavHeight() > this.startingY) {
        console.log('no more')
        this.setState({isStatic: false, position: feedScrollTop - 153})
      }
    } else {
      console.log('NOT static')
      if (feedScrollTop + this.topNavHeight() < this.startingY) {
        console.log('now it is')
        this.setState({isStatic: true})
      }
    }
  })

  componentDidMount () {
    const { feedId } = this.props
    this.startingY = position(this.refs.placeholder).y - 5
    this.setState({isStatic: viewportTop() + this.topNavHeight() < this.startingY})
    const feedElement = document.getElementById(feedId)
    if (feedElement) {
      feedElement.addEventListener('scroll', this.handleScrollEvents)
    }
  }

  render () {
    const { tabName, sortOption, onChange, className } = this.props
    const { isStatic, position } = this.state

    const styleNames = cx('tabBar', isStatic ? 'static' : 'floating')

    const style = isStatic ? {} : {top: position}

    return <div ref='placeholder' className={className} styleName='placeholder'>
      <div styleName={styleNames} style={style}>
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
