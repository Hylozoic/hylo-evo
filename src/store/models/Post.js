import { attr, fk, many, Model } from 'redux-orm'

const fields = {
  id: attr(),
  name: attr(),
  author: fk('Person'),
  communities: many('Community')
}

export default class Post extends Model {
  static parse (postData) {
    const {
      id,
      community_ids,
      description,
      name,
      user_id
    } = postData

    this.processRelations(postData)

    return this.create({
      id,
      name,
      description,
      author: user_id,
      communities: community_ids,
      comments: postData.comments.map(c => c.id)
    })
  }

  static processRelations ({ comments, communities, people }) {
    const { Comment, Community, Person } = this.session
    comments.forEach(c => Comment.parse(c))
    communities.forEach(c => Community.parse(c))
    people.forEach(p => Person.parse(p))
  }

  // TODO: Might need to get much more fine-grained than this, depending on what
  // the API expects (including re-hydrating arrays of relations).
  toJSON () {
    const { id, author, comments, communities, description, name } = this.ref
    return JSON.stringify({
      id,
      user_id: author,
      comments,
      community_ids: communities,
      description,
      name
    })
  }

  toString () {
    return `Post: ${this.name}`
  }
}

Post.modelName = 'Post'
Post.fields = fields
