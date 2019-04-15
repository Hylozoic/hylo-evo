import React, { Component } from 'react'

import cx from 'classnames'
import { times, isEmpty } from 'lodash/fp'
import '../NetworkSettings.scss'

export default class PaginatedList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      prevItems: []
    }
  }

  updatePrevItems () {
    const { pending, items } = this.props
    const { prevItems } = this.state
    if (pending || items === prevItems || isEmpty(items)) return
    this.setState({prevItems: items})
  }

  componentDidMount () {
    this.updatePrevItems()
  }

  componentDidUpdate () {
    this.updatePrevItems()
  }

  render () {
    const {
      className,
      items,
      header,
      page,
      pageCount,
      pending,
      renderItem,
      setPage
    } = this.props
    const { prevItems } = this.state
    const visibleItems = pending ? prevItems : items

    return <div styleName={cx('paginated-list', {loading: pending})} className={className}>
      {header && header}
      {visibleItems.map(item => renderItem(item))}
      <PaginationLinks page={page} pageCount={pageCount} setPage={setPage} />
    </div>
  }
}

export function PaginationLinks ({ pageCount, setPage, page }) {
  if (pageCount < 2) return null

  function PageLink ({ i }) {
    const current = i === page
    return <span styleName={current ? 'page-current' : 'page-link'} onClick={() => !current && setPage(i)}>{i + 1}</span>
  }

  return <div styleName='pagination-links'>
    {times(i => <PageLink key={i} i={i} />, pageCount)}
  </div>
}
