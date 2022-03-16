import useEnsureCurrentGroup from 'hooks/useEnsureCurrentGroup'
import React, { useState } from 'react'
import './FarmGroupDetailBody.scss'

/*
  - Determine what widgets are needed
  - Do we run the "Widgets" container component or just insert widgets individually
  - 
*/

export default function FarmGroupDetailBody ({
  currentUser,
  currentUserHasMemberships
}) {
  const { group } = useEnsureCurrentGroup()
  const widgets = ((group && group.widgets) || []).filter(w => w.name !== 'map' && w.context === 'group_profile')

  return (
    <>
    <div>
    words

    </div>
    </>
  )
}
