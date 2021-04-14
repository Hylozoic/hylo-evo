const groupFieldsFragment = ({ withTopics, withJoinQuestions, withPrerequisites }) => `
  id
  accessibility
  avatarUrl
  bannerUrl
  description
  location
  memberCount
  name
  settings {
    allowGroupInvites
    askGroupToGroupJoinQuestions
    askJoinQuestions
    publicMemberDirectory
    showSuggestedSkills
  }
  slug
  visibility
  childGroups {
    items {
      id
      accessibility
      avatarUrl
      bannerUrl
      name
      slug
      visibility
    }
  }
  locationObject {
    id
    addressNumber
    addressStreet
    bbox {
      lat
      lng
    }
    center {
      lat
      lng
    }
    city
    country
    fullText
    locality
    neighborhood
    region
  }
  members(first: 8, sortBy: "name", order: "desc") {
    items {
      id
      name
      avatarUrl
    }
  }
  moderators {
    items {
      id
      name
      avatarUrl
    }
  }
  parentGroups {
    items {
      id
      accessibility
      avatarUrl
      bannerUrl
      name
      slug
      visibility
    }
  }
  ${withTopics ? `
  groupTopics(first: 8) {
    items {
      id
      topic {
        id
        name
      }
      postsTotal
    }
  }` : ''}
  ${withJoinQuestions ? `
  groupToGroupJoinQuestions {
    items {
      id
      questionId
      text
    }
  }
  joinQuestions {
    items {
      id
      questionId
      text
    }
  }
  suggestedSkills {
    items {
      id
      name
    }
  }` : ''}
  ${withPrerequisites ? `
  prerequisiteGroups(onlyNotMember: true) {
    items {
      avatarUrl
      id
      name
      settings {
        allowGroupInvites
        askGroupToGroupJoinQuestions
        askJoinQuestions
        publicMemberDirectory
      }
      slug
    }
  }
  numPrerequisitesLeft
  ` : ''}
`

export default groupFieldsFragment
