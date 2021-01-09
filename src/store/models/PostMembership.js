import { attr, fk, Model } from 'redux-orm'

class PostMembership extends Model {
  toString () {
    return `PostMembership: ${this.id}`
  }
}

export default PostMembership

PostMembership.modelName = 'PostMembership'
PostMembership.fields = {
  id: attr(),
  pinned: attr(),
  community: fk('Community', 'postMemberships')
}
