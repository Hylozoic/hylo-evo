import { attr, Model } from 'redux-orm'

class ModerationAction extends Model {
  toString () {
    return `ModerationAction (${this.id}): ${this.title}`
  }
}

export default ModerationAction

ModerationAction.modelName = 'ModerationAction'

ModerationAction.fields = {
  id: attr(),
  groupId: attr(),
  postId: attr(),
  status: attr(),
  text: attr()
}
