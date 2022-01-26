import gql from 'graphql-tag'

// export default function GroupFieldsFragment ({ withTopics, withJoinQuestions, withPrerequisites }) {
export default gql`
  fragment GroupFieldsFragment on Group {
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
        memberCount
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
    groupTopics(first: 8) @include(if: $withTopics) {
      items {
        id
        topic {
          id
          name
        }
        postsTotal
      }
    }
    joinQuestions @include(if: $withJoinQuestions) {
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
    }
    prerequisiteGroups(onlyNotMember: true) @include(if: $withPrerequisites) {
      items {
        avatarUrl
        id
        name
        settings {
          allowGroupInvites
          askGroupToGroupJoinQuestions
          askJoinQuestions
          publicMemberDirectory
          showSuggestedSkills
        }
        slug
      }
    }
    numPrerequisitesLeft
  }
`
