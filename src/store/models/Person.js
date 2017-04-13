import { attr, many, Model } from 'redux-orm'

const Person = Model.createClass({
  toString () {
    return `Person: ${this.name}`
  }
})

export default Person

Person.modelName = 'Person'

Person.fields = {
  id: attr(),
  name: attr(),
  bio: attr(),
  avatarUrl: attr(),
  bannerUrl: attr(),
  twitterName: attr(),
  facebookUrl: attr(),
  linkedinUrl: attr(),
  url: attr(),
  location: attr(),
  memberships: many('Membership', 'person'),
  membershipsTotal: attr(),
  posts: many('Post', 'creator'),
  postsTotal: attr()
}
