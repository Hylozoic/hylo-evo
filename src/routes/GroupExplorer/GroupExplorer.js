import React from 'react'
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
  return (
    <React.Fragment>
      <ExplorerBanner />
      <GroupSearch />
    </React.Fragment>
  )
}
