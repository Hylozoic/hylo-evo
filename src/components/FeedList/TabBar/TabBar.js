/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types'

import React from 'react'
import Dropdown from 'components/Dropdown'
import Icon from 'components/Icon'
import './TabBar.scss'

const tabs = [
  { id: 'all', label: 'All' },
  { id: 'discussion', label: 'Discussions' },
  { id: 'request', label: 'Requests' },
  { id: 'offer', label: 'Offers' },
  { id: 'resource', label: 'Resources' }
]

const sortOptions = [
  { id: 'updated', label: 'Latest Activity' },
  { id: 'created', label: 'Post Date' },
  { id: 'votes', label: 'Popular' }
]

class TabBar extends React.Component {
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
    const { forwardedRef, selectedTab, selectedSort, onChangeTab, onChangeSort } = this.props

    return <div styleName='bar' ref={forwardedRef}>
      <div styleName='tabs'>
        <div styleName='filterLabel'>Post types: <strong>{selectedTab}</strong> <Icon name='ArrowDown' /></div>
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

export default React.forwardRef((props, ref) => <TabBar {...props} forwardedRef={ref} />)
