import React, { useState } from 'react'
import Icon from 'components/Icon'
import AffiliationsWidget from 'components/Widget/AffiliationsWidget'
import AnnouncementWidget from 'components/Widget/AnnouncementWidget'
import EventsWidget from 'components/Widget/EventsWidget'
import GroupTopicsWidget from 'components/Widget/GroupTopicsWidget'
import MembersWidget from 'components/Widget/MembersWidget'
import OffersAndRequestsWidget from 'components/Widget/OffersAndRequestsWidget'
import ProjectsWidget from 'components/Widget/ProjectsWidget'
import RecentPostsWidget from 'components/Widget/RecentPostsWidget'
import WelcomeWidget from 'components/Widget/WelcomeWidget'
import VisibilityToggle from 'components/VisibilityToggle'
import './Widget.scss'

const WIDGET_TITLE = {
  text_block: 'Welcome message',
  announcements: 'Announcement',
  active_members: 'Recently active members',
  requests_offers: 'Open requests & offers',
  posts: 'Recent posts',
  community_topics: 'Community topics',
  events: 'Upcoming events',
  project_activity: 'Recent project activity',
  group_affiliations: 'Subgroups and affiliations',
  map: 'Community map'
}

export default function Widget (props) {
  const { id, isVisible, name, settings, updateWidget } = props

  const [viewingMore, viewMore] = useState(false)
  const [editingSettings, editSettings] = useState(false)
  const [newSettings, updateSettings] = useState(settings)

  return (
    <div styleName='widget'>
      <div styleName='header'>
        <h3>{(settings && settings.title) || WIDGET_TITLE[name]}</h3>
        <div styleName='more'>

          <Icon name='More' styleName={`more ${viewingMore ? 'selected' : ''}`} onClick={() => { viewMore(!viewingMore); editSettings(false) }} />
          {editingSettings &&
            <EditForm
              id={id}
              editSettings={editSettings}
              viewMore={viewMore}
              newSettings={newSettings}
              updateSettings={updateSettings}
              save={updateWidget} />}

          {!editingSettings && <div styleName={`edit-section ${viewingMore ? 'visible' : ''}`}>
            <span styleName='triangle'>&nbsp;</span>
            {name === 'text_block' && <div styleName='edit-settings'><Icon name='Edit' onClick={() => editSettings(!editingSettings)} /> Edit welcome message</div>}
            <VisibilityToggle
              id={id}
              checked={isVisible}
              onChange={() => updateWidget(id, { isVisible: !isVisible })}
              styleName='widget-visibility'
              backgroundColor={isVisible ? '#0DC39F' : '#8B96A4'} /> Visibility: {isVisible ? 'Visible' : 'Hidden'}
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
          editSettings(false)
          viewMore(true)
        }}>Cancel</span>
        <span styleName='save' onClick={() => save(id, { settings: newSettings })}>Save</span>
      </div>

    </div>
  )
}

const HiddenWidget = ({ isVisible, name }) => {
  return (
    <div>
      <div>Visibility: {isVisible ? 'Visible' : 'Hidden'}</div>
      <div>The {name} section is not visible to members of this group</div>
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
  if (!isVisible) return <HiddenWidget isVisible={isVisible} name={name} />
  switch (name) {
    case 'text_block': {
      return <WelcomeWidget settings={settings} />
    }
    case 'announcements': {
      const announcements = [{ // group && group.announcements && group.announcements.items
        title: 'Nutrient Density working group forming! Sign up here!',
        author: 'Amanda Rodriguez',
        created: '3 HRS AGO',
        image: '/default-announcement.png'
      }, {
        title: 'Bioregional healthcare is coming to the Bay Area!',
        author: 'Clare Politano',
        created: '1 WEEK AGO',
        image: '/default-announcement.png'
      }]
      return announcements && <AnnouncementWidget announcements={announcements} />
    }
    case 'active_members': {
      const members = group && group.activeMembers && group.activeMembers.items
      return <MembersWidget members={members} />
    }
    case 'requests_offers': {
      const offersAndRequests = [{ // group && group.offersAndRequests && group.offersAndRequests.items
        title: 'Seeking an accountant familiar with non-profits working with MediCal',
        author: 'Brooke Daily',
        avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/30591/userAvatar/30591/10216723681744864.jpg',
        numComments: '1',
        kind: 'offer'
      }, {
        title: 'I can map your land using lidar and drones! Available to help within 50 mi. of Bay Area',
        author: 'Raphi Dondo',
        avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/29528/userAvatar/29528/2020-02-15_RSphoto_1135_2k_Hand.jpg',
        numComments: '24',
        kind: 'request'
      }]
      return <OffersAndRequestsWidget offersAndRequests={offersAndRequests} />
    }
    case 'posts': {
      return <RecentPostsWidget posts={posts} showDetails={showDetails} />
    }
    case 'community_topics': {
      const topics = group && group.groupTopics
      return <GroupTopicsWidget topics={topics} />
    }
    case 'events': {
      const events = [{ // group && group.events && group.events.items
        time: 'Thursday, April 26, 3:00p - 4:00p',
        title: 'Mindfulness 101',
        location: 'https://zoom.us/j/380357601',
        image: '/default-event.png'
      }, {
        time: 'Scoopday, May 15, 5:00p',
        title: 'Holonic relationships - how we get from here to there and back again',
        location: '100 Main St., Covid, CA, 94117',
        image: '/default-event.png'
      }]
      return <EventsWidget events={events} routeParams={routeParams} showDetails={showDetails} />
    }
    case 'project_activity': {
      const projects = [{ // group && group.projects && group.projects.items
        id: '1234',
        title: 'Project: Extend Hylo Projects',
        lastActivity: '3 HRS AGO',
        createdBy: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/29528/userAvatar/29528/2020-02-15_RSphoto_1135_2k_Hand.jpg'
      }, {
        id: '1334',
        title: 'Project: Extend Hylo Projects',
        lastActivity: 'yesterday',
        createdBy: 'https://d3ngex8q79bk55.cloudfront.net/evo-uploads/user/29528/userAvatar/29528/2020-02-15_RSphoto_1135_2k_Hand.jpg'
      }]
      return <ProjectsWidget projects={projects} routeParams={routeParams} showDetails={showDetails} />
    }
    case 'group_affiliations': {
      const affiliations = [{
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
      return <AffiliationsWidget affiliations={affiliations} />
    }
    default: {
      return <div>Nothing to see here</div>
    }
  }
}
