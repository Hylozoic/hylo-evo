import { getAtAGlance, getFarmOpportunities, getOpenToPublic } from 'store/selectors/farmExtensionSelectors'

export default function useGetWidgetItems ({ currentUser, childGroups, name, group, posts }) {
  switch (name) {
    case 'text_block': {
      return true
    }
    case 'mission': {
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
    case 'nearby_relevant_groups': {
      return [] // TODO: build out selector for this
    }
    case 'relevant_events': {
      const items = posts.filter((post) => post.type === 'event')
      return items.length > 0 ? items : null
    }
    case 'relevant_requests_offers': {
      const items = posts.filter((post) => post.type === 'offer' || post.type === 'request')
      return items.length > 0 ? items : null
    }
    case 'relevant_project_activity': {
      const items = posts.filter((post) => post.type === 'project')
      return items.length > 0 ? items : null
    }
    case 'farm_comparison': {
      return true
    }
    case 'farm_details': {
      return !(group.settings && group.settings.hideExtensionData)
    }
    case 'farm_open_to_public': {
      return !(group.settings && group.settings.hideExtensionData) && getOpenToPublic(group)
    }
    case 'opportunities_to_collaborate': {
      return !(group.settings && group.settings.hideExtensionData) && getFarmOpportunities(group).length > 0
    }
    case 'farm_at_a_glance': {
      return !(group.settings && group.settings.hideExtensionData) && getAtAGlance(group).length > 0
    }
    case 'farm_map': {
      return group.locationObject && group.locationObject.center && posts
    }
    case 'stewards': {
      return [] // TODO: build out selector for this
    }
    case 'topics': {
      return [] // TODO: build out selector for this
    }
    case 'join':
    case 'privacy_settings': {
      return true
    }
    default: {
      return false
    }
  }
}
