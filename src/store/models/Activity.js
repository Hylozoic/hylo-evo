import { attr, fk, Model } from 'redux-orm'

const Activity = Model.createClass({
  toString () {
    return `Message: ${this.id}`
  }
})

export default Activity

Activity.modelName = 'Activity'

Activity.fields = {
  id: attr(),
  actor: fk('Person'),
  post: fk('Post'),
  comment: fk('Comment'),
  unread: attr(),
  action: attr(),
  meta: attr()
}
