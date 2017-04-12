import { attr, many, Model } from 'redux-orm'

const Me = Model.createClass({
  toString () {
    return `Me: ${this.name}`
  }
})

export default Me

Me.modelName = 'Me'
Me.fields = {
  name: attr(),
  posts: many('Post'),
  memberships: many('Membership'),
  messageThreads: many('MessageThread')
}
