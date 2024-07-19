import React from 'react'
import { TextHelpers } from 'hylo-shared'
import useEnsureCurrentGroup from 'hooks/useEnsureCurrentGroup'
import useEnsurePosts from 'hooks/useEnsurePosts'
import Widget from 'components/Widget'
import './FarmGroupDetailBody.scss'
import { getBio } from 'store/selectors/farmExtensionSelectors'

export default function FarmGroupDetailBody ({
  currentUser,
  isMember,
  routeParams
}) {
  const { group } = useEnsureCurrentGroup()
  const { posts } = useEnsurePosts({ public: true, sortBy: 'updated', context: 'groups', currentUser })
  const bio = getBio(group)

  // TODO: hide widgets if they have no data, means loading all the data here?
  const widgets = [
    { settings: {}, isVisible: true, name: 'farm_at_a_glance' },
    {
      name: 'mission',
      isVisible: true,
      settings: {
        embeddedVideoURI: group.aboutVideoUri,
        text: !!group.description && bio,
        richText: TextHelpers.markdown(group.description)
      }
    },
    { settings: {}, isVisible: true, name: 'farm_details' },
    { settings: {}, isVisible: true, name: 'opportunities_to_collaborate' },
    { settings: {}, isVisible: !!currentUser, name: 'relevant_requests_offers' },
    { settings: {}, isVisible: !!currentUser, name: 'relevant_project_activity' },
    { settings: {}, isVisible: !!currentUser, name: 'relevant_events' },
    { settings: {}, isVisible: true, name: 'farm_map' },
    { settings: {}, isVisible: true, name: 'farm_open_to_public' }
  ]
  // TODO: when widgets are properly updated in the DB use this: const widgets = ((group && group.widgets) || []).filter(w => w.name !== 'map' && w.context === 'group_profile')

  return (
    <>
      <div styleName='farm-group-detail-body'>
        {widgets && widgets.map(widget =>
          <Widget
            {...widget}
            key={widget.name}
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
