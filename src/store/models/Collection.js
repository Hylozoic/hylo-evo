import { attr, fk, many, Model } from 'redux-orm'

export class CollectionPost extends Model { }
CollectionPost.modelName = 'CollectionPost'
CollectionPost.fields = {
  id: attr(),
  order: attr(),
  collectionId: attr(),
  post: fk('Post'),
  user: fk('Person')
}

export default class Collection extends Model {
  toString () {
    return `Collection: ${this.name}`
  }
}
Collection.modelName = 'Collection'
Collection.fields = {
  id: attr(),
  createdAt: attr(),
  name: attr(),
  updatedAt: attr(),

  group: fk('Group'),
  linkedPosts: many('CollectionPost'),
  posts: many('Post'),
  user: fk('Person')
}
