import { attr, Model, fk } from 'redux-orm'

const CommunityTopic = Model.createClass({
  toString () {
    return `CommunityTopic: ${this.topic}`
  }
})

export default CommunityTopic

CommunityTopic.modelName = 'CommunityTopic'

CommunityTopic.fields = {
  id: attr(),
  topic: fk('Topic', 'communityTopics'),
  community: fk('Community', 'communityTopics'),
  postsTotal: attr(),
  followersTotal: attr()
}
