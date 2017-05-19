/* eslint-disable no-unused-vars */
import React, { PropTypes } from 'react'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import { capitalize, sortBy } from 'lodash/fp'
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

  render () {
    const { selectedTab, selectedSort, onChangeTab, onChangeSort } = this.props

    return <div styleName='bar'>
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
  }
}
