import { attr, Model, fk } from 'redux-orm'

const TopicSubscription = Model.createClass({
  toString () {
    return `TopicSubscription: ${this.topic}`
  }
})

export default TopicSubscription

TopicSubscription.modelName = 'TopicSubscription'

TopicSubscription.fields = {
  id: attr(),
  topic: fk('Topic', 'topicSubscriptions'),
  newPostCount: attr()
}
