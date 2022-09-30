import { attr, fk, many, Model } from 'redux-orm'

class Collection extends Model {
  toString () {
    return `Collection: ${this.name}`
  }
}

export default Collection

Collection.modelName = 'Collection'

Collection.fields = {
  id: attr(),
  createdAt: attr(),
  name: attr(),
  updatedAt: attr(),

  group: fk('Group'),
  posts: many('Post'),
  user: fk('Person')
}
