import { attr, Model, fk } from 'redux-orm'

class GroupTopic extends Model {
  toString () {
    return `GroupTopic: ${this.topic}`
  }
}

export default GroupTopic

GroupTopic.modelName = 'GroupTopic'

GroupTopic.fields = {
  id: attr(),
  topic: fk('Topic', 'groupTopics'),
  group: fk('Group', 'groupTopics'),
  postsTotal: attr(),
  followersTotal: attr()
}
