import React from 'react'
import useEnsureCurrentGroup from 'hooks/useEnsureCurrentGroup'
import Widget from 'components/Widget'
import './FarmGroupDetailBody.scss'

export default function FarmGroupDetailBody ({
  currentUser,
  routeParams
}) {
  const { group } = useEnsureCurrentGroup()
  const widgets = [
    { settings: {}, isVisible: true, name: 'mission' },
    { settings: {}, isVisible: true, name: 'opportunities_to_collaborate' },
    { settings: {}, isVisible: true, name: 'nearby_relevant_requests_offers' },
    { settings: {}, isVisible: true, name: 'project_activity' },
    { settings: {}, isVisible: true, name: 'nearby_relevant_events' },
    { settings: {}, isVisible: true, name: 'farm_map' }
  ]
  // TODO: when widgets are properly updated in the DB use this: const widgets = ((group && group.widgets) || []).filter(w => w.name !== 'map' && w.context === 'group_profile')
  return (
    <>
      <div styleName='farm-group-detail-body'>
        {widgets && widgets.map(widget =>
          <Widget
            {...widget}
            // childGroups={childGroups} // needs to be verified once other widgets are sorted
            key={widget.id}
            group={group}
            isModerator={false}
            // posts={posts} // needs to be verified once other widgets are sorted
            routeParams={routeParams} // TODO: replace this with useRouter?
          />
        )}

      </div>
    </>
  )
}
