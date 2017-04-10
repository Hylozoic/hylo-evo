import { attr, fk, Model } from 'redux-orm'

const FeedItem = Model.createClass({
  toString () {
    return `Post: ${this.name}`
  }
})

export default FeedItem

FeedItem.modelName = 'FeedItem'
FeedItem.fields = {
  type: attr(),
  post: fk('Post')
}
