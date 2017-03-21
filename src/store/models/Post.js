import { omit } from 'lodash'
import { attr, fk, Model } from 'redux-orm'

export default class Post extends Model {
  toString () {
    return `Post: ${this.name}`
  }

  static processRelatedData (postData) {
    const { Person, Community } = this.session
    const { people, communities } = postData
    people.forEach(person => Person.parse(person))
    communities.forEach(community => Community.parse(community))
    return omit(postData, ['people', 'communities'])
  }

  static parse (postData) {
    const { Comment } = this.session
    let clonedData = this.processRelatedData(postData)
    clonedData = {
      ...clonedData,
      author: postData.user_id,
      communities: postData.community_ids,
      comments: postData.comments.map(commentData => Comment.parse(commentData))
    }
    clonedData = omit(clonedData, ['user_id', 'community_id'])
    return this.create(clonedData)
  }
}

Post.modelName = 'Post'

Post.fields = {
  id: attr(),
  name: attr(),
  author: fk('Person'),
  communities: many('Community')
}
