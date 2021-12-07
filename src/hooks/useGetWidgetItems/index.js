// import { useState, useEffect } from 'react'

export default function useGetWidgetItems ({ currentUser, childGroups, name, group, posts }) {
  // so by moving this function into its own hook
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
    case 'nearby_relevant_groups': {
      return [] // TODO: build out data get/fetch hook for relevant groups
    }
    case 'nearby_relevant_events': {
      return [] // TODO: build out data get/fetch hook for relevant groups
    }
    case 'nearby_relevant_requests_offers': {
      return [] // TODO: build out data get/fetch hook for relevant groups
    }
    case 'farm_comparison': {
      return true // TODO: build out data get/fetch hook for relevant groups
    }
    case 'opportunities_to_collaborate': {
      return [] // TODO: build out selector for this
    }
    case 'farm_map': {
      return [] // TODO: figure out what even needs to be displayed for this
    }
    case 'moderators': {
      return [] // TODO: build out selector for this
    }
    case 'privacy_settings': {
      return true
    }
    default: {
      return false
    }
  }
}
