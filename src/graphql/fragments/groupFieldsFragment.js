const groupFieldsFragment = ({ withTopics, withJoinQuestions, withPrerequisites }) => `
  id
  accessibility
  avatarUrl
  bannerUrl
  description
  name
  settings {
    allowGroupInvites
    askJoinQuestions
    publicMemberDirectory
  }
  slug
  visibility
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
  memberCount
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
  location
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
  ${withTopics ? `groupTopics(first: 8) {
    items {
      id
      topic {
        id
        name
      }
      postsTotal
    }
  }` : ''}
  ${withJoinQuestions ? `joinQuestions {
    items {
      id
      questionId
      text
    }
  }` : ''}
  ${withPrerequisites ? `prerequisiteGroups(onlyNotMember: true) {
    items {
      avatarUrl
      id
      name
      settings {
        allowGroupInvites
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
