/* eslint-disable no-unused-vars */
import React, { PropTypes } from 'react'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import { capitalize, sortBy, throttle } from 'lodash/fp'
import { CENTER_COLUMN_ID, viewportTop, position } from 'util/scrolling'
import cx from 'classnames'
import './TabBar.scss'

const tabs = [
  {id: 'all', label: 'All'},
  {id: 'discussion', label: 'Discussions'},
  {id: 'request', label: 'Requests'},
  {id: 'offer', label: 'Offers'}
]

const sortOptions = [
  {id: 'updated', label: 'Latest'},
  {id: 'votes', label: 'Popular'}
]

// how far down from the top the bar is when it's fixed
const offset = 144

export default class TabBar extends React.Component {
  static propTypes = {
    onChangeTab: PropTypes.func,
    onChangeSort: PropTypes.func,
    selectedTab: PropTypes.string,
    selectedSort: PropTypes.string
  }

  static defaultProps = {
    selectedTab: tabs[0].id,
    selectedSort: sortOptions[0].id,
    onChangeTab: () => {},
    onChangeSort: () => {}
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
    const { selectedTab, selectedSort, onChangeTab, onChangeSort } = this.props
    const { fixed } = this.state

    return <div ref='placeholder' styleName='placeholder'>
      <div styleName={cx('bar', {fixed})}>
        <div styleName='tabs'>
          {tabs.map(({ id, label }) => <span
            key={id}
            styleName={id === selectedTab ? 'tab-active' : 'tab'}
            onClick={() => onChangeTab(id)}>
            {label}
          </span>)}
        </div>
        <Dropdown styleName='sorter'
          toggleChildren={<span styleName='sorter-label'>
            {sortOptions.find(o => o.id === selectedSort).label}
            <Icon name='ArrowDown' />
          </span>}
          items={sortOptions.map(({ id, label }) => ({
            label,
            onClick: () => onChangeSort(id)
          }))}
          alignRight />
      </div>
    </div>
  }
}
