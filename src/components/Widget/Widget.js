import React from 'react'
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

export default class Widget extends React.Component {
  constructor(props) {
    super(props)
    this.state = { editing: false }
  }

  setEditing = () => this.setState({ editing: !this.state.editing })
  
  render() {
    const { toggleVisibility, id, isVisible, name } = this.props
    const { editing } = this.state

    return (
      <div styleName='widget'>
        <div styleName='header'>
          <div>{name}</div>
          <div styleName='more'>
            <Icon name='More' styleName={`more ${editing ? 'selected' : ''}`} onClick={this.setEditing} />
            <div styleName={`edit-section ${editing ? 'visible' : ''}`}>
              <span styleName='triangle'>&nbsp;</span>
              <VisibilityToggle id={id} checked={isVisible} onChange={toggleVisibility} backgroundColor={isVisible ? '#0DC39F' : '#8B96A4'} /> Visibility: Visible
            </div>
          </div>
        </div>

        <div styleName={`content ${isVisible ? '' : 'hidden'}`}>
          <ChildWidget {...this.props} />
        </div>
      </div>
    )
  }
}

const HiddenWidget = ({ isVisible, name }) => {
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
  showDetails
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
      return <WelcomeWidget />
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