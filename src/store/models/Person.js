import PropTypes from 'prop-types'
import { attr, fk, many, Model } from 'redux-orm'

export class PersonSkillsToLearn extends Model {}
PersonSkillsToLearn.modelName = 'PersonSkillsToLearn'
PersonSkillsToLearn.fields = {
  person: fk('Person', 'personSkillsToLearn'),
  skillToLearn: fk('Skill', 'personSkillsToLearn')
}

export class MembershipCommonRole extends Model { }
MembershipCommonRole.modelName = 'MembershipCommonRole'
MembershipCommonRole.fields = {
  id: attr(),
  commonRoleId: attr(),
  groupId: attr(),
  userId: attr(),
  commonRole: fk('CommonRole', 'membershipCommonRoles')
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
  membershipCommonRoles: many('MembershipCommonRole'),
  skills: many({ to: 'Skill', as: 'skills', relatedName: 'peopleHaving' }),
  skillsToLearn: many({
    to: 'Skill',
    relatedName: 'peopleLearning',
    through: 'PersonSkillsToLearn',
    throughFields: ['person', 'skillToLearn']
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
  const commonRoles = person.membershipCommonRoles?.toModelArray().filter(mcr => mcr.groupId === groupId).map(mcr => ({ ...mcr.commonRole.ref, common: true })) || []
  // console.log("commonRoles", person.name, commonRoles)
  // return person.groupRoles.items.filter(role => role.groupId === groupId)
  //if (!person || !groupId || !Array.isArray(person.groupRoles.items)) return []
  return commonRoles.concat(person.groupRoles.items.filter(role => role.groupId === groupId)) || []
}

export const AXOLOTL_ID = '13986'
