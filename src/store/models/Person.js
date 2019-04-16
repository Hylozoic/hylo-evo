import PropTypes from 'prop-types'
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

export const PERSON_PROP_TYPES = {
  id: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired,
  name: PropTypes.string.isRequired,
  avatarUrl: PropTypes.string.isRequired
}

export const firstName = person => person.name.split(' ')[0]

export const AXOLOTL_ID = '13986'
