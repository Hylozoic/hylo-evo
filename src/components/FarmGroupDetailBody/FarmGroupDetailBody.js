import React from 'react'
import useEnsureCurrentGroup from 'hooks/useEnsureCurrentGroup'
import useEnsurePosts from 'hooks/useEnsurePosts'
import Widget from 'components/Widget'
import './FarmGroupDetailBody.scss'

export default function FarmGroupDetailBody ({
  currentUser,
  isMember,
  routeParams
}) {
  const { group } = useEnsureCurrentGroup()
  const { posts } = useEnsurePosts({ public: true, sortBy: 'updated', context: 'groups' })

  const widgets = [
    { settings: {}, isVisible: true, name: 'mission' },
    { settings: {}, isVisible: true, name: 'opportunities_to_collaborate' },
    { settings: {}, isVisible: true, name: 'relevant_requests_offers' },
    { settings: {}, isVisible: true, name: 'relevant_project_activity' },
    { settings: {}, isVisible: true, name: 'relevant_events' },
    { settings: {}, isVisible: true, name: 'farm_map' }
  ]
  // TODO: when widgets are properly updated in the DB use this: const widgets = ((group && group.widgets) || []).filter(w => w.name !== 'map' && w.context === 'group_profile')

  return (
    <>
      <div styleName='farm-group-detail-body'>
        {widgets && widgets.map(widget =>
          <Widget
            {...widget}
            key={widget.id}
            group={group}
            isMember={isMember}
            isModerator={false}
            posts={posts}
            routeParams={routeParams}
          />
        )}

      </div>
    </>
  )
}
