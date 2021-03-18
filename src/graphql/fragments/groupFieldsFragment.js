const groupFieldsFragment = ({ withTopics, withJoinQuestions }) => `
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
      name
      slug
      visibility
      childGroups(first: 300) {
        items {
          id
        }
      }
    }
  }
  childGroups {
    items {
      id
      accessibility
      avatarUrl
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
`

export default groupFieldsFragment
