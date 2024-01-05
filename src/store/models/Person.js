import PropTypes from 'prop-types'
import { attr, fk, many, Model } from 'redux-orm'

export class PersonSkillsToLearn extends Model {}
PersonSkillsToLearn.modelName = 'PersonSkillsToLearn'
PersonSkillsToLearn.fields = {
  person: fk('Person', 'personSkillsToLearn'),
  skillToLearn: fk('Skill', 'personSkillsToLearn')
}

class Person extends Model {
  toString () {
    return `Person: ${this.name}`
  }
}

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
  locationId: fk({
    to: 'Location',
    as: 'locationObject'
  }),
  skills: many({ to: 'Skill', as: 'skills', relatedName: 'peopleHaving' }),
  skillsToLearn: many({
    to: 'Skill',
    relatedName: 'peopleLearning',
    through: 'PersonSkillsToLearn',
    throughFields: [ 'person', 'skillToLearn' ]
  }),
  postsTotal: attr()
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
export const twitterUrl = twitterName => twitterName && `https://twitter.com/${twitterName}`
export const combineRoles = ({ person, groupId }) => {
  if (!person || !groupId) return []
  return person.commonRoles.items.concat(person.groupRoles?.items.filter(role => role.groupId === groupId)) || []
}

export const AXOLOTL_ID = '13986'
