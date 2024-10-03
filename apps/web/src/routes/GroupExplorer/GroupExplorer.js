import React, { useState } from 'react'
import { Helmet } from 'react-helmet'
import ExplorerBanner from './ExplorerBanner'
import GroupViewFilter from './GroupViewFilter'
import GroupSearch from './GroupSearch'
import { ALL_VIEW } from 'util/constants'
import classes from './GroupExplorer.module.scss'

export default function GroupExplorer ({
  currentUser,
  currentUserHasMemberships
}) {
  const [viewFilter, setViewFilter] = useState(ALL_VIEW)

  const handleChangeViewFilter = (value) => setViewFilter(value)

  return (
    <React.Fragment>
      <Helmet>
        <title>Group Explorer | Hylo</title>
        <meta name='description' content='Find the others on Hylo' />
      </Helmet>
      <ExplorerBanner />
      <GroupViewFilter viewFilter={viewFilter} changeView={handleChangeViewFilter} />
      <GroupSearch viewFilter={viewFilter} />
    </React.Fragment>
  )
}
