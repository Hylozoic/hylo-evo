import { attr, fk, Model } from 'redux-orm'

class Vote extends Model {
  toString () {
    return `Vote: ${this.id}`
  }
}

export default Vote

Vote.modelName = 'Vote'

Vote.fields = {
  id: attr(),
  post: fk('Post', 'votes'),
  voter: fk('Person', 'votes'),
  dateVoted: attr()
}
