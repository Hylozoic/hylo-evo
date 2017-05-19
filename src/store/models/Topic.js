import { attr, Model } from 'redux-orm'

const Topic = Model.createClass({
  toString () {
    return `Topic: ${this.name}`
  }
})

export default Topic

Topic.modelName = 'Topic'

Topic.fields = {
  id: attr(),
  name: attr(),
  postsTotal: attr(),
  followersTotal: attr()
}
