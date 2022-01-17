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

const WIDGETS = {
  text_block: {
    title: '',
    moderatorTitle: 'Welcome Message',
    component: WelcomeWidget
  },
  announcements: {
    title: 'Announcements',
    component: AnnouncementWidget
  },
  active_members: {
    title: 'Recently Active Members',
    component: MembersWidget
  },
  requests_offers: {
    title: 'Open Requests & Offers',
    component: OffersAndRequestsWidget
  },
  posts: {
    title: 'Recent Posts',
    component: RecentPostsWidget
  },
  community_topics: {
    title: 'Community Topics',
    component: GroupTopicsWidget
  },
  events: {
    title: 'Upcoming Events',
    component: EventsWidget
  },
  project_activity: {
    title: 'Recently Active Projects',
    component: ProjectsWidget
  },
  group_affiliations: {
    title: 'Subgroups',
    component: GroupsWidget
  }
}

export default function Widget (props) {
  const { childGroups, currentUser, group, id, isModerator, isVisible, name, posts, routeParams, settings, updateWidget } = props

  if (!WIDGETS[name]) return null

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEditingSettings, setIsEditingSettings] = useState(false)
  const [newSettings, updateSettings] = useState({
    title: settings.title || '',
    text: settings.text || ''
  })

  const widgetItems = getWidgetItems({ childGroups, currentUser, name, group, posts })

  return (
    <div styleName={`widget ${isEditingSettings ? 'editing-settings' : ''}`}>
      {isModerator || (isVisible && widgetItems) ? <div styleName='header'>
        <h3>{(isModerator && WIDGETS[name].moderatorTitle) || WIDGETS[name].title}</h3>
        {isModerator && <div styleName='more'>
          <Icon name='More' styleName={`more-icon ${isMenuOpen ? 'selected' : ''}`} onClick={() => { setIsMenuOpen(!isMenuOpen); setIsEditingSettings(false) }} />
          <div styleName={`edit-menu ${isMenuOpen ? 'visible' : ''}`}>
            {!isEditingSettings && <div styleName='edit-section'>
              <span styleName='triangle'>&nbsp;</span>
              {name === 'text_block' && <div styleName='edit-settings'><span onClick={() => setIsEditingSettings(!isEditingSettings)}><Icon name='Edit' /> Edit welcome message</span></div>}
              <div styleName='visibility-settings'>
                <VisibilityToggle
                  id={id}
                  checked={isVisible}
                  onChange={() => updateWidget(id, { isVisible: !isVisible })}
                  styleName='widget-visibility'
                  backgroundColor={isVisible ? 'gray' : 'black'} /> <span styleName='visibility-label'>Visibility:</span> {isVisible ? 'Visible' : 'Hidden'}
              </div>
            </div>}
          </div>
        </div>}
      </div> : ''}
      {isModerator && isEditingSettings &&
        <EditForm
          id={id}
          setIsEditingSettings={setIsEditingSettings}
          setIsMenuOpen={setIsMenuOpen}
          newSettings={newSettings}
          updateSettings={updateSettings}
          save={updateWidget} />}
      <div styleName={`content ${isVisible ? '' : 'hidden'}`}>
        {isVisible ? (widgetItems ? React.createElement(WIDGETS[name].component, { items: widgetItems, group, routeParams, settings }) : null)
          : isModerator ? <HiddenWidget name={name} /> : null
        }
      </div>
    </div>
  )
}

const HiddenWidget = ({ isVisible, name }) => {
  return (
    <div styleName='hidden-description'>
      <h4><Icon name='Hidden' styleName='hidden-icon' /> Hidden</h4>
      <p>The {WIDGETS[name].moderatorTitle || WIDGETS[name].title} section is not visible to members of this group. Click the three dots (<Icon name='More' styleName='more-icon' />) above this box to change the visibility settings. Only moderators can see this message.</p>
    </div>
  )
}

const getWidgetItems = ({ currentUser, childGroups, name, group, posts }) => {
  switch (name) {
    case 'text_block': {
      return true
    }
    case 'announcements': {
      return group.announcements.length > 0 ? group.announcements : false
    }
    case 'active_members': {
      return group.members && group.members.length > 2 ? group.members.filter(m => m.id !== currentUser.id).sort((a, b) => b.lastActiveAt - a.lastActiveAt).slice(0, 8) : false
    }
    case 'requests_offers': {
      return group.openOffersAndRequests.length > 0 ? group.openOffersAndRequests : false
    }
    case 'posts': {
      return posts.length > 0 ? posts : false
    }
    case 'community_topics': {
      return group.groupTopics.length > 0 ? group.groupTopics.slice(0, 10) : false
    }
    case 'events': {
      return group.upcomingEvents
    }
    case 'project_activity': {
      return group.activeProjects
    }
    case 'group_affiliations': {
      return childGroups.length > 0 ? childGroups : false
    }
    default: {
      return false
    }
  }
}

const EditForm = ({ id, setIsEditingSettings, setIsMenuOpen, newSettings, updateSettings, save }) => {
  return (
    <div styleName='edit-form'>
      <div>
        <input
          type='text'
          autoFocus
          onChange={e => updateSettings({ ...newSettings, title: e.target.value.substring(0, 50) })}
          placeholder='Enter a title'
          value={newSettings.title}
        />
        <div styleName='chars'>{(newSettings.title && newSettings.title.length) || 0}/{50}</div>
      </div>

      <div>
        <textarea
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
        <span styleName='save' onClick={() => { save(id, { settings: newSettings }); setIsEditingSettings(false); setIsMenuOpen(false) }}>Save</span>
      </div>

    </div>
  )
}
