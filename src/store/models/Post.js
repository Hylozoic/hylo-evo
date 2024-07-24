import { attr, fk, many, Model } from 'redux-orm'
import PropTypes from 'prop-types'

// proposal templates
export const PROPOSAL_YESNO = 'Yes/No'
export const PROPOSAL_POLL_SINGLE = 'Poll, Single Vote'
export const PROPOSAL_ADVICE = 'Advice'
export const PROPOSAL_CONSENT = 'Consent'
export const PROPOSAL_CONSENSUS = 'Consensus'
export const PROPOSAL_SCHEDULING = 'Scheduling'
export const PROPOSAL_GRADIENT = 'Gradient of Agreement'
export const PROPOSAL_MULTIPLE_CHOICE = 'Multiple Choice'

// proposal types
export const VOTING_METHOD_SINGLE = 'single'
export const VOTING_METHOD_MULTI_UNRESTRICTED = 'multi-unrestricted'
// export const VOTING_METHOD_CONSENSUS = 'consensus'

// proposal status
export const PROPOSAL_STATUS_DISCUSSION = 'discussion'
export const PROPOSAL_STATUS_VOTING = 'voting'
export const PROPOSAL_STATUS_CASUAL = 'casual'
export const PROPOSAL_STATUS_COMPLETED = 'completed'

export class PostFollower extends Model {}
PostFollower.modelName = 'PostFollower'
PostFollower.fields = {
  post: fk('Post', 'postfollowers'),
  follower: fk('Person', 'postfollowers')
}

export class PostCommenter extends Model {}
PostCommenter.modelName = 'PostCommenter'
PostCommenter.fields = {
  post: fk('Post', 'postcommenters'),
  commenter: fk('Person', 'postcommenters')
}

export class ProjectMember extends Model {}
ProjectMember.modelName = 'ProjectMember'
ProjectMember.fields = {
  post: fk('Post', 'projectmembers'),
  member: fk('Person', 'projectmembers')
}

class Post extends Model {
  toString () {
    return `Post: ${this.name}`
  }
}

export default Post

Post.modelName = 'Post'
Post.fields = {
  id: attr(),
  title: attr(),
  type: attr(),
  location: attr(),
  locationId: fk({
    to: 'Location',
    as: 'locationObject'
  }),
  details: attr(),
  linkPreview: fk('LinkPreview', 'posts'),
  creator: fk('Person', 'posts'),
  followers: many({
    to: 'Person',
    relatedName: 'postsFollowing',
    through: 'PostFollower',
    throughFields: ['post', 'follower']
  }),
  groups: many('Group'),
  groupsTotal: attr(),
  postMemberships: many('PostMembership'),
  commenters: many({
    to: 'Person',
    relatedName: 'postsCommented',
    through: 'PostCommenter',
    throughFields: ['post', 'commenter']
  }),
  members: many({
    to: 'Person',
    relatedName: 'projectsJoined',
    through: 'ProjectMember',
    throughFields: ['post', 'member']
  }),
  commentersTotal: attr(),
  createdAt: attr(),
  startsAt: attr(),
  endsAt: attr(),
  fulfilledAt: attr(),
  donationsLink: attr(),
  projectManagementLink: attr(),
  peopleReactedTotal: attr(),
  timezone: attr(),
  topics: many('Topic'),
  isPublic: attr()
}

export const POST_TYPES = {
  chat: {
    primaryColor: [0, 163, 227, 255], // $color-picton-blue
    backgroundColor: 'rgba(0, 163, 227, .2)', // $color-link-water
    map: false,
    label: 'Chat',
    description: 'Quick topic-based chats'
  },
  discussion: {
    primaryColor: [0, 163, 227, 255], // $color-picton-blue
    backgroundColor: 'rgba(0, 163, 227, .2)', // $color-link-water
    map: true,
    label: 'Discussion',
    description: 'Talk about what\'s important with others'
  },
  request: {
    primaryColor: [102, 75, 165, 255], // $color-persimmon;
    backgroundColor: 'rgba(102, 75, 165, .2)', // $color-peach-schnapps;
    map: true,
    label: 'Request',
    description: 'What can people help you with?'
  },
  offer: {
    primaryColor: [0, 199, 157, 255], // $color-caribbean-green
    backgroundColor: 'rgba(0, 199, 157, .2)', // $color-iceberg;
    map: true,
    label: 'Offer',
    description: 'What do you have for others?'
  },
  resource: {
    primaryColor: [255, 212, 3, 255], // $color-mango-yellow;
    backgroundColor: 'rgba(255, 212, 3, .2)',
    map: true,
    label: 'Resource',
    description: 'Let people know about available resources'
  },
  project: {
    primaryColor: [252, 128, 0, 255], // $color-fuchsia-pink;
    backgroundColor: 'rgba(252, 128, 0, .2)', // $color-prim;
    map: true,
    label: 'Project',
    description: 'Create a project that people can help with'
  },
  event: {
    primaryColor: [254, 72, 80, 255], // $color-medium-purple
    backgroundColor: 'rgba(254, 72, 80, .2)', // $color-moon-raker
    map: true,
    label: 'Event',
    description: 'Invite people to your event'
  },
  proposal: {
    primaryColor: [0, 163, 227, 255], // $color-picton-blue
    backgroundColor: 'rgba(0, 163, 227, .2)', // $color-link-water
    map: true,
    label: 'Proposal',
    description: 'Suggest a proposal for others to vote on'
  }
}

export const POST_PROP_TYPES = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  type: PropTypes.string,
  title: PropTypes.string,
  details: PropTypes.string,
  location: PropTypes.string,
  locationObject: PropTypes.object,
  name: PropTypes.string,
  updatedAt: PropTypes.string,
  imageUrl: PropTypes.string,
  linkPreview: PropTypes.object,
  groups: PropTypes.array,
  isPublic: PropTypes.bool
}

export const PROPOSAL_TEMPLATES = {
  [PROPOSAL_YESNO]: {
    form: {
      proposalOptions: [
        {
          text: 'Yes',
          emoji: '👍',
          color: ''
        },
        {
          text: 'No',
          emoji: '👎',
          color: ''
        }
      ],
      votingMethod: VOTING_METHOD_SINGLE,
      title: ''
    },
    title: PROPOSAL_YESNO,
    tooltip: 'Simple yes or no poll'
  },
  [PROPOSAL_POLL_SINGLE]: {
    form: {
      proposalOptions: [
        {
          text: 'Option 1',
          emoji: '1️⃣',
          color: ''
        },
        {
          text: 'Option 2',
          emoji: '2️⃣',
          color: ''
        },
        {
          text: 'Option 3',
          emoji: '3️⃣',
          color: ''
        }
      ],
      votingMethod: VOTING_METHOD_SINGLE,
      title: 'Poll: '
    },
    title: PROPOSAL_POLL_SINGLE,
    tooltip: 'Single vote poll'
  },
  [PROPOSAL_MULTIPLE_CHOICE]: {
    form: {
      proposalOptions: [
        {
          text: 'Option 1',
          emoji: '1️⃣',
          color: ''
        },
        {
          text: 'Option 2',
          emoji: '2️⃣',
          color: ''
        },
        {
          text: 'Option 3',
          emoji: '3️⃣',
          color: ''
        },
        {
          text: 'Option 4',
          emoji: '4️⃣',
          color: ''
        },
        {
          text: 'Option 5',
          emoji: '5️⃣',
          color: ''
        }
      ],
      votingMethod: VOTING_METHOD_MULTI_UNRESTRICTED,
      title: 'Multiple Choice:'
    },
    title: PROPOSAL_MULTIPLE_CHOICE,
    tooltip: 'A poll where users can vote multiple times'
  },
  [PROPOSAL_ADVICE]: {
    form: {
      proposalOptions: [
        {
          text: 'Agree',
          emoji: '✅',
          color: ''
        },
        {
          text: 'Concern',
          emoji: '❓',
          color: ''
        }
      ],
      votingMethod: VOTING_METHOD_SINGLE,
      title: 'Advice: '
    },
    title: PROPOSAL_ADVICE,
    tooltip: 'For the Advice Process - gather input before makig a decision'
  },
  [PROPOSAL_CONSENT]: {
    form: {
      proposalOptions: [
        {
          text: 'Consent',
          emoji: '✅',
          color: ''
        },
        {
          text: 'Objection',
          emoji: '🔴',
          color: ''
        }
      ],
      votingMethod: VOTING_METHOD_SINGLE,
      title: 'Consent: '
    },
    title: PROPOSAL_CONSENT,
    tooltip: 'Consent is a lighter weight consensus, is this good enough for now, safe enough to try?'
  },
  [PROPOSAL_CONSENSUS]: {
    form: {
      proposalOptions: [
        {
          text: 'Agree',
          emoji: '✅',
          color: ''
        },
        {
          text: 'Abstain',
          emoji: '➡️',
          color: ''
        },
        {
          text: 'Disagree',
          emoji: '🟠',
          color: ''
        },
        {
          text: 'Block',
          emoji: '🔴',
          color: ''
        }
      ],
      votingMethod: VOTING_METHOD_SINGLE,
      title: 'Consensus: '
    },
    title: PROPOSAL_CONSENSUS,
    tooltip: 'Consensus means that everyone must agree. One block/veto stops the proposal'
  },
  [PROPOSAL_GRADIENT]: {
    form: {
      proposalOptions: [
        {
          text: 'Strong Agree',
          emoji: '✅✅',
          color: ''
        },
        {
          text: 'Agree',
          emoji: '✅',
          color: ''
        },
        {
          text: 'Some concerns',
          emoji: '❓',
          color: ''
        },
        {
          text: 'Abstain',
          emoji: '➡️',
          color: ''
        },
        {
          text: 'Disagree',
          emoji: '🔴',
          color: ''
        },
        {
          text: 'Strong Disagree',
          emoji: '🔴🔴',
          color: ''
        }
      ],
      votingMethod: VOTING_METHOD_SINGLE,
      title: ''
    },
    title: PROPOSAL_GRADIENT,
    tooltip: 'Get a weighted opinion on a topic, how much do folks agree or not?'
  }
}
