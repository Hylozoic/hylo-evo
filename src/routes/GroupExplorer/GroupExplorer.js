import { get } from 'lodash/fp'
import React, { useState } from 'react'
import ExplorerBanner from './ExplorerBanner'
import GroupSearch from './GroupSearch'
import './GroupExplorer.scss'

/*
  - Take/modify the ExplorerBanner, might need asset from Aaron DONE
  - Use ViewControls to add filters,
  - control required query/queries; when do we request? when do we page?
  - how can this be smoothly extended to consider other group types?
*/

export default function GroupExplorer ({
  currentUser,
  currentUserHasMemberships
}) {
  // componentDidMount () {
  //   this.fetchPosts(0)
  // }

  // componentDidUpdate (prevProps) {
  //   if (!prevProps) return

  //   const hasChanged = propHasChanged(this.props, prevProps)

  //   if (hasChanged('postTypeFilter') ||
  //     hasChanged('sortBy') ||
  //     hasChanged('context') ||
  //     hasChanged('group.id')) {
  //     this.fetchPosts(0)
  //   }
  // }

  // fetchPosts (offset) {
  //   const { pending, hasMore, fetchPosts } = this.props

  //   if (pending || hasMore === false) return

  //   fetchPosts(offset)
  // }

  return (
    <React.Fragment>
      <ExplorerBanner />
      <GroupSearch sortBy={sortBy} changeSort={setSortBy} routeParams={query} search={search} setSearch={setSearch} />
    </React.Fragment>
  )
}

// {
//   static propTypes = {
//     routeParams: PropTypes.object,
//     selectedPostId: PropTypes.string,
//     postTypeFilter: PropTypes.string,
//     sortBy: PropTypes.string,
//     fetchPosts: PropTypes.func.isRequired,
//     changeTab: PropTypes.func.isRequired,
//     changeSort: PropTypes.func.isRequired,
//     changeView: PropTypes.func.isRequired
//   }
