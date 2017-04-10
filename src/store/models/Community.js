import { attr, many, Model } from 'redux-orm'

const Community = Model.createClass({
  toString () {
    return `Community: ${this.name}`
  }
})

export default Community

Community.modelName = 'Community'

Community.fields = {
  id: attr(),
  name: attr(),
  members: many('Person'),
  feedItems: many('FeedItem'),
  posts: many('Post'),
  postCount: attr(),
  feedOrder: attr()
}
