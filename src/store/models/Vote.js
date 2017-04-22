import { attr, fk, Model } from 'redux-orm'

const Vote = Model.createClass({
  toString () {
    return `Vote: ${this.id}`
  }
})

export default Vote

Vote.modelName = 'Vote'

Vote.fields = {
  id: attr(),
  post: fk('Post'),
  voter: fk('Person'),
  dateVoted: attr()
}
