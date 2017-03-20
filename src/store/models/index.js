import {fk, many, attr, Model} from 'redux-orm'

class Post extends Model {
  toString () {
    return `Post: ${this.name}`
  }
  // Declare any static or instance methods you need.
}
Post.modelName = 'Post'

// Declare your related fields.
Post.fields = {
  id: attr(), // non-relational field for any value optional but highly recommended
  name: attr(),
  user: fk('Person'),
  people: many('Person'),
  communities: many('Community')
}
