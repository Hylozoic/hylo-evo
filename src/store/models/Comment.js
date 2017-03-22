import { omit } from 'lodash'
import { attr, fk, many, oneToOne, Model } from 'redux-orm'

export default class Comment extends Model {
  toString () {
    return `Comment: ${this.name}`
  }

  static parse (commentData) {
    let clonedData = {
      ...commentData,
      user: commentData.user_id
    }
    clonedData = omit(clonedData, ['user_id'])
    return this.create(clonedData)
  }
}

Comment.modelName = 'Comment'

Comment.fields = {
  id: attr(),
  text: attr(),
  user: fk('Person')
}
