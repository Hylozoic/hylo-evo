import React, { useState } from 'react'
import Icon from 'components/Icon'
import AffiliationsWidget from 'components/Widget/AffiliationsWidget'
import AnnouncementWidget from 'components/Widget/AnnouncementWidget'
import EventsWidget from 'components/Widget/EventsWidget'
import GroupTopicsWidget from 'components/Widget/GroupTopicsWidget'
import MapWidget from 'components/Widget/MapWidget'
import MembersWidget from 'components/Widget/MembersWidget'
import OffersAndRequestsWidget from 'components/Widget/OffersAndRequestsWidget'
import ProjectsWidget from 'components/Widget/ProjectsWidget'
import RecentPostsWidget from 'components/Widget/RecentPostsWidget'
import WelcomeWidget from 'components/Widget/WelcomeWidget'
import VisibilityToggle from 'components/VisibilityToggle'
import './Widget.scss'

export default function Widget (props) {
  const { toggleVisibility, id, isVisible, name, settings, updateWidgetSettings } = props
  
  const [viewingMore, viewMore] = useState(false)
  const [editingSettings, editSettings] = useState(false)
  const [newSettings, updateSettings] = useState(settings)

  return (
    <div styleName='widget'>
      <div styleName='header'>
        <div>{settings && settings.title || name}</div>
        <div styleName='more'>

          <Icon name='More' styleName={`more ${viewingMore ? 'selected' : ''}`} onClick={() => {viewMore(!viewingMore); editSettings(false) }} />
          {editingSettings && <EditForm id={id} editSettings={editSettings} viewMore={viewMore} newSettings={newSettings} updateSettings={updateSettings} save={updateWidgetSettings}/>}
        
          {!editingSettings && <div styleName={`edit-section ${viewingMore ? 'visible' : ''}`}>
            <span styleName='triangle'>&nbsp;</span>
            {settings && <div styleName='edit-settings'><Icon name='Edit' onClick={() => editSettings(!editingSettings)}/> Edit welcome message</div>}
            <VisibilityToggle id={id} checked={isVisible} onChange={toggleVisibility} backgroundColor={isVisible ? '#0DC39F' : '#8B96A4'} /> Visibility: {isVisible ? 'Visible' : 'Hidden'}
          </div>}
        </div>
      </div>

      <div styleName={`content ${isVisible ? '' : 'hidden'}`}>
        <ChildWidget {...props} />
      </div>
    </div>
  )
  }

const EditForm = ({ id, editSettings, viewMore, newSettings, updateSettings, save }) => {
  return (
    <div styleName='edit-form'>

      <div>
        <input
          type='text'
          onChange={e => updateSettings({...newSettings, title: e.target.value.substring(0,50)})}
          placeholder='Enter a title'
          value={newSettings.title}
        />
        <div styleName='chars'>{newSettings.title && newSettings.title.length || 0}/{50}</div>
      </div>
      
      <div>
        <input
          type='text'
          onChange={e => updateSettings({...newSettings, text: e.target.value.substring(0,500)})}
          placeholder='Enter your message here'
          value={newSettings.text}
        />
        <div styleName='chars'>{newSettings.text && newSettings.text.length || 0}/{500}</div>
      </div>

      <div styleName='buttons'>
        <span styleName='cancel' onClick={() => {
          editSettings(false)
          viewMore(true)
        }}>Cancel</span>
        <span styleName='save' onClick={() => save({ id, data: newSettings })}>Save</span>
      </div>
      
    </div> 
  )
}

const HiddenWidget = ({ isVisible, name}) => {
  return (
    <div>
      <div>Visibility: {!!isVisible ? 'Visible' : 'Hidden'}</div>
      <div>The {name} section is not visible to members of this community</div>
    </div>
  )
}

const ChildWidget = ({
  isVisible,
  name,
  group,
  posts = [],
  routeParams,
  showDetails,
  settings
  }) => {
  if (!isVisible) return <HiddenWidget isVisible={isVisible} name={name}/>
  const announcements = group && group.announcements && group.announcements.items
  const events = group && group.events && group.events.items
  const members = group && group.recentlyActiveMembers
  const offersAndRequests = group && group.offersAndRequests && group.offersAndRequests.items
  const projects = group && group.projects && group.projects.items
  const topics = group && group.groupTopics
  switch(name) {
    case 'Welcome message': {
      return <WelcomeWidget settings={settings}/>
    }
    case 'Announcement': {
      return <AnnouncementWidget announcements={announcements} />
    }
    case 'Recently active members': {
      return <MembersWidget members={members} />
    }
    case 'Open requests & offers': {
      return <OffersAndRequestsWidget offersAndRequests={offersAndRequests} />
    }
    case 'Recent posts': {
      return <RecentPostsWidget posts={posts} showDetails={showDetails} />
    }
    case 'Community topics': {
      return <GroupTopicsWidget topics={topics} />
    }
    case 'Upcoming events': {
      return <EventsWidget events={events} routeParams={routeParams} showDetails={showDetails} />
    }
    case 'Recent project activity': {
      return <ProjectsWidget projects={projects} routeParams={routeParams} showDetails={showDetails} />
    }
    case 'Subgroups and affiliations': {
      return <AffiliationsWidget />
    }
    case 'Community map': {
      return <MapWidget />
    }
    default: {
      return <div>Nothing to see here</div>
    }
  }
}