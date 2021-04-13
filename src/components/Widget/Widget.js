import React, { useState } from 'react'
import Icon from 'components/Icon'
import AnnouncementWidget from 'components/Widget/AnnouncementWidget'
import EventsWidget from 'components/Widget/EventsWidget'
import GroupsWidget from 'components/Widget/GroupsWidget'
import GroupTopicsWidget from 'components/Widget/GroupTopicsWidget'
import MembersWidget from 'components/Widget/MembersWidget'
import OffersAndRequestsWidget from 'components/Widget/OffersAndRequestsWidget'
import ProjectsWidget from 'components/Widget/ProjectsWidget'
import RecentPostsWidget from 'components/Widget/RecentPostsWidget'
import WelcomeWidget from 'components/Widget/WelcomeWidget'
import VisibilityToggle from 'components/VisibilityToggle'
import './Widget.scss'

const WIDGET_TITLE = {
  text_block: '',
  announcements: 'Announcements',
  active_members: 'Recently Active Members',
  requests_offers: 'Open Requests & Offers',
  posts: 'Recent Posts',
  community_topics: 'Community Topics',
  events: 'Upcoming Events',
  project_activity: 'Recently Active Projects',
  group_affiliations: 'Subgroups',
  map: 'Community Map'
}

export default function Widget (props) {
  const { id, isVisible, name, settings, updateWidget } = props

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditingSettings, setIsEditingSettings] = useState(false)
  const [newSettings, updateSettings] = useState(settings)

  return (
    <div styleName='widget'>
      <div styleName='header'>
        <h3>{(settings && settings.title) || WIDGET_TITLE[name]}</h3>
        <div styleName='more'>

          <Icon name='More' styleName={`more ${isMenuOpen ? 'selected' : ''}`} onClick={() => { setIsMenuOpen(!isMenuOpen); setIsEditingSettings(false) }} />
          {isEditingSettings &&
            <EditForm
              id={id}
              setIsEditingSettings={setIsEditingSettings}
              setIsMenuOpen={setIsMenuOpen}
              newSettings={newSettings}
              updateSettings={updateSettings}
              save={updateWidget} />}

          {!isEditingSettings && <div styleName={`edit-section ${isMenuOpen ? 'visible' : ''}`}>
            <span styleName='triangle'>&nbsp;</span>
            {name === 'text_block' && <div styleName='edit-settings'><Icon name='Edit' onClick={() => setIsEditingSettings(!isEditingSettings)} /> Edit welcome message</div>}
            <VisibilityToggle
              id={id}
              checked={isVisible}
              onChange={() => updateWidget(id, { isVisible: !isVisible })}
              styleName='widget-visibility'
              backgroundColor={isVisible ? 'gray' : 'black'} /> {isVisible ? 'Visible' : 'Hidden'}
          </div>}
        </div>
      </div>

      <div styleName={`content ${isVisible ? '' : 'hidden'}`}>
        <ChildWidget {...props} />
      </div>
    </div>
  )
}

const EditForm = ({ id, setIsEditingSettings, setIsMenuOpen, newSettings, updateSettings, save }) => {
  return (
    <div styleName='edit-form'>
      <div>
        <input
          type='text'
          onChange={e => updateSettings({ ...newSettings, title: e.target.value.substring(0, 50) })}
          placeholder='Enter a title'
          value={newSettings.title}
        />
        <div styleName='chars'>{(newSettings.title && newSettings.title.length) || 0}/{50}</div>
      </div>

      <div>
        <input
          type='text'
          onChange={e => updateSettings({ ...newSettings, text: e.target.value.substring(0, 500) })}
          placeholder='Enter your message here'
          value={newSettings.text}
        />
        <div styleName='chars'>{(newSettings.text && newSettings.text.length) || 0}/{500}</div>
      </div>

      <div styleName='buttons'>
        <span styleName='cancel' onClick={() => {
          setIsEditingSettings(false)
          setIsMenuOpen(true)
        }}>Cancel</span>
        <span styleName='save' onClick={() => { save(id, { settings: newSettings }); setIsEditingSettings(false) }}>Save</span>
      </div>

    </div>
  )
}

const HiddenWidget = ({ isVisible, name }) => {
  return (
    <div>
      <div>Hidden</div>
      <div>The {WIDGET_TITLE[name]} section is not visible to members of this group</div>
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
  if (!isVisible) return <HiddenWidget name={name} />
  switch (name) {
    case 'text_block': {
      return <WelcomeWidget group={group} settings={settings} />
    }
    case 'announcements': {
      const announcements = (group && group.announcements) || []
      return announcements.length > 0 && <AnnouncementWidget announcements={announcements} group={group} showDetails={showDetails} />
    }
    case 'active_members': {
      const members = (group && group.members && group.members.sort((a, b) => b.lastActiveAt - a.lastActiveAt).slice(0, 8)) || []
      return members.length > 0 && <MembersWidget group={group} members={members} />
    }
    case 'requests_offers': {
      const offersAndRequests = (group && group.openOffersAndRequests) || []
      return offersAndRequests.length > 0 && <OffersAndRequestsWidget group={group} offersAndRequests={offersAndRequests} />
    }
    case 'posts': {
      return <RecentPostsWidget posts={posts} showDetails={showDetails} />
    }
    case 'community_topics': {
      const topics = (group && group.groupTopics) || []
      return topics.length > 0 && <GroupTopicsWidget topics={topics} />
    }
    case 'events': {
      const events = (group && group.upcomingEvents) || []
      return events.length > 0 && <EventsWidget events={events} group={group} />
    }
    case 'project_activity': {
      const projects = (group && group.activeProjects) || []
      return projects.length > 0 && <ProjectsWidget group={group} projects={projects} />
    }
    case 'group_affiliations': {
      const groups = [{
        id: '1234',
        groupName: 'Annual Meeting 2020',
        groupAvatar: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/30730/networkAvatar/55/Screen%20Shot%202020-07-01%20at%2011.16.56%20AM.png',
        groupBackground: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/30730/networkBanner/55/Screen%20Shot%202020-07-01%20at%2011.14.47%20AM.png',
        // truncate groupDescription after 100 characters and append elipses
        groupDescription: 'Annual Meeting Description - The program theme is “Technology and Neuroscience.” This meeting will review ...',
        memberCount: '72 Members',
        isMember: true,
        groupUrl: 'http://localhost:3000/group/groupname'
      }, {
        id: '5678',
        groupName: 'PH Student Club',
        groupAvatar: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/30730/networkAvatar/55/Screen%20Shot%202020-07-01%20at%2011.16.56%20AM.png',
        groupBackground: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/30730/networkBanner/55/Screen%20Shot%202020-07-01%20at%2011.14.47%20AM.png',
        // truncate groupDescription after 100 characters and append elipses
        groupDescription: 'Annual Meeting Description - The program theme is “Technology and Neuroscience.” This meeting will review ...',
        memberCount: '72 Members',
        isMember: false,
        groupUrl: 'http://localhost:3000/group/groupname'
      }, {
        id: '9101',
        groupName: 'PH Student Club',
        groupAvatar: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/30730/networkAvatar/55/Screen%20Shot%202020-07-01%20at%2011.16.56%20AM.png',
        groupBackground: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/30730/networkBanner/55/Screen%20Shot%202020-07-01%20at%2011.14.47%20AM.png',
        // truncate groupDescription after 100 characters and append elipses
        groupDescription: 'Annual Meeting Description - The program theme is “Technology and Neuroscience.” This meeting will review ...',
        memberCount: '72 Members',
        isMember: false,
        groupUrl: 'http://localhost:3000/group/groupname'
      }]
      return <GroupsWidget groups={groups} />
    }
    default: {
      return <div>Nothing to see here</div>
    }
  }
}
