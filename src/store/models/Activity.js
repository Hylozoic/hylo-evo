import { attr, fk, Model } from 'redux-orm'

class Activity extends Model {
  toString () {
    return `Message: ${this.id}`
  }
}

export default Activity

Activity.modelName = 'Activity'

Activity.fields = {
  id: attr(),
  actor: fk('Person'),
  post: fk('Post'),
  comment: fk('Comment'),
  group: fk('Group'),
  unread: attr(),
  action: attr(),
  meta: attr()
}
