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
  skills: many('Skill'),
  postsTotal: attr(),
  votesTotal: attr()
}

export const firstName = person => person.name.split(' ')[0]
export const DEFAULT_AVATAR = 'https://www.gravatar.com/avatar/1f3347b940681f7fa199fc0aae113371?d=mm&s=140'

export const BLOCKED_USER = {
  id: -1,
  name: 'A Hylo User',
  avatarUrl: DEFAULT_AVATAR
}
