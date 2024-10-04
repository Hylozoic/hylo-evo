import { attr, Model } from 'redux-orm'

export const TOPIC_VISIBILITY = {
  0: 'Hidden',
  1: 'Visible',
  2: 'Pinned'
}

class Topic extends Model {
  toString () {
    return `Topic: ${this.name}`
  }
}

export default Topic

Topic.modelName = 'Topic'

Topic.fields = {
  id: attr(),
  name: attr(),
  postsTotal: attr(),
  followersTotal: attr()
}
