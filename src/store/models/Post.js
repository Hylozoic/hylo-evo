import { omit } from 'lodash'
import { attr, fk, many, oneToOne, Model } from 'redux-orm'

export default class Post extends Model {
  toString () {
    return `Post: ${this.name}`
  }

  static processRelatedData (postData) {
    const { Person, Community } = this.session
    const { people, communities } = postData
    people.forEach(person => Person.create(person))
    communities.forEach(community => Community.parse(community))
    return omit(postData, ['people', 'communities'])
  }

  static parse (postData) {
    let clonedData = this.processRelatedData(postData)
    clonedData = {
      ...clonedData,
      user: postData.user_id,
      author: postData.user_id
    }
    return this.create(clonedData)
  }

  static toJSON () {
    const data = {
      ...this.ref,
      user_id: this.user.id
    }
    return data
  }
}
Post.modelName = 'Post'
Post.fields = {
  id: attr(),
  name: attr(),
  user: fk('Person'),
  author: fk('Person', 'author')
}
