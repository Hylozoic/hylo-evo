import { attr, fk, Model } from 'redux-orm'

export default class FeedItem extends Model {
  toString () {
    return `Post: ${this.name}`
  }
}

FeedItem.modelName = 'FeedItem'
FeedItem.fields = {
  type: attr(),
  post: fk('Post')
}

