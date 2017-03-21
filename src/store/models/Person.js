import { attr, Model } from 'redux-orm'

export default class Person extends Model {
  toString () {
    return `Person: ${this.name}`
  }
  // Declare any static or instance methods you need.
}
Person.modelName = 'Person'
Person.fields = {
  id: attr(),
  name: attr(),
  avatar_url: attr()
}
