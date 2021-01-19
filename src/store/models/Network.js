import { attr, many, Model, fk } from 'redux-orm'

export class NetworkModerator extends Model {}
NetworkModerator.modelName = 'NetworkModerator'
NetworkModerator.fields = {
  network: fk('Network', 'networkmoderators'),
  moderator: fk('Person', 'networkmoderators')
}

class Network extends Model {
  toString () {
    return `Network: ${this.name}`
  }
}

export default Network

Network.modelName = 'Network'

Network.fields = {
  id: attr(),
  name: attr(),
  description: attr(),
  avatarUrl: attr(),
  bannerUrl: attr(),
  members: many('Person'),
  moderators: many({
    to: 'Person',
    relatedName: 'moderatedNetworks',
    through: 'NetworkModerator',
    throughFields: [ 'network', 'moderator' ]
  }),
  communities: many('Community'),
  posts: many('Post')
}

export const DEFAULT_BANNER = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_banner.jpg'
export const DEFAULT_AVATAR = 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png'
