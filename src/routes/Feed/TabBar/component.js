/* eslint-disable no-unused-vars */
import React from 'react'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import { capitalize, sortBy, throttle } from 'lodash/fp'
import { viewportTop, position } from 'util/scrolling'
import { CENTER_COLUMN_ID } from 'routes/PrimaryLayout'
import cx from 'classnames'
import './component.scss'

export const tabNames = [
  'all', 'discussions', 'activity', 'requests', 'offers'
]

export const sortOptions = [
  'latest', 'popular'
]

// how far down from the top the bar is when it's fixed
const offset = 144

export default class TabBar extends React.Component {
  static defaultProps = {
    tabName: 'all',
    sortOption: 'latest',
    onChange: settings => console.log('Tab Bar changed: ', settings)
  }

  constructor (props) {
    super(props)
    this.state = {}
  }

  handleScrollEvents = throttle(50, event => {
    const { scrollTop } = this.element

    if (this.state.fixed && scrollTop < this.threshold + offset) {
      this.setState({fixed: false})
    } else if (!this.state.fixed && scrollTop > this.threshold + offset) {
      this.setState({fixed: true})
    }
  })

  componentDidMount () {
    this.element = document.getElementById(CENTER_COLUMN_ID)
    this.threshold = position(this.refs.placeholder).y
    this.setState({
      fixed: this.element.scrollTop > this.threshold + offset
    })
    this.element.addEventListener('scroll', this.handleScrollEvents)
  }

  componentWillUnmount () {
    this.element.removeEventListener('scroll', this.handleScrollEvents)
  }

  render () {
    const { tabName, sortOption, onChange } = this.props
    const { fixed } = this.state

    return <div ref='placeholder' styleName='placeholder'>
      <div styleName={cx('bar', {fixed})}>
        <div styleName='tabs'>
          {tabNames.map(name => <span
            key={name}
            styleName={name === tabName ? 'tab-active' : 'tab'}
            onClick={() => onChange({tab: name})}>
            {capitalize(name)}
          </span>)}
        </div>
        <Dropdown styleName='sorter'
          toggleChildren={<span styleName='sorter-label'>
            {capitalize(sortOption)}
            <Icon name='ArrowDown' />
          </span>}>
          {sortBy(s => s === sortOption, sortOptions).map(option => <li
            key={option}
            onClick={() => onChange({sort: option})}>
            {capitalize(option)}
          </li>)}
        </Dropdown>
      </div>
    </div>
  }
}
